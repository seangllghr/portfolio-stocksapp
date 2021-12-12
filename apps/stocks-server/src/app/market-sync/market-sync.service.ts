import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as csv from 'csv/sync';
import { firstValueFrom } from 'rxjs';
import * as config from '../../assets/config.json';
import { Stock } from '../stock/schemas/stock.schema';
import { Match, SearchResults } from '@portfolio-stocksapp/shared-data-model';
import moment = require('moment-timezone');

enum UpdateType {
  OVERVIEW = 1,
  TIME_SERIES,
  DEFER,
}

interface UpdateObject {
  updateType: UpdateType;
  symbol: string;
}

const UPDATE_JOB_NAME = 'updateJob';
const REPOPULATE_JOB_NAME = 'repopulateJob';

@Injectable()
export class MarketSyncService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>,
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  private updateQueue: UpdateObject[] = [];
  private frontendCanRequest = true;
  private frontendRequestCount = 0;

  /**
   * Declare a cron job to run the next update task in the queue.
   *
   * NOTE: AlphaVantage, the API we're using for market data, has a limit of
   * 5 API calls per minute at its free tier. Thus, our update service is built
   * around this limitation. For a production system, this could be relaxed.
   */
  @Cron('*/12 * * * * *', {
    name: UPDATE_JOB_NAME,
  })
  runUpdateTask(): void {
    this.runNextUpdate();
  }

  /**
   * Declare a cron job to repopulate the update queue once per day
   *
   * NOTE: In addition to the 5/minute rate limit, we also have a limit of 500
   * calls per day. Since we're only using daily time series data, it doesn't
   * really make sense to update more often than this, anyway.
   */
  @Cron('0 1 * * 2-6', {
    name: REPOPULATE_JOB_NAME,
    timeZone: 'UTC'
  })
  async repopulateUpdateQueue() {
    Logger.log('Repopulating the update queue');
    const numUpdates = await this.populateUpdateQueue();
    Logger.log(`Queued ${numUpdates} updates`);
  }

  /**
   * Initialize update queueing
   */
  @Timeout(500)
  async initUpdateQueue() {
    Logger.log('Initializing update queue');
    const numUpdates = await this.populateUpdateQueue();
    Logger.log(`Queued ${numUpdates} updates`);
  }

  async getStockList(): Promise<string[]> {
    const results = await this.stockModel
      .aggregate()
      .match({})
      .project({ _id: 0, Symbol: 1 });
    const list = [];
    results.forEach((result) => list.push(result.Symbol));
    return list;
  }

  /**
   * Populate update queue with update objects, to be processed by runNextUpdate
   */
  async populateUpdateQueue(forceTimeSeries = false): Promise<number> {
    // Stop the update job while we populate the list. We don't need the full
    // stop sequence here, so we call the SchedulerRegistry directly, rather
    // than use this.stopUpdate().
    this.schedulerRegistry.getCronJob(UPDATE_JOB_NAME).stop();
    if (this.updateQueue.length > 0) return 0; // return if queue not empty
    let numUpdates = 0;

    // Get the symbols array
    const stocks = await this.getStockList();

    // Loop through the symbols array, locate each one in the database,
    // and add the appropriate update tasks to the queue.
    for (const symbol of stocks) {
      Logger.debug(`Queueing updates for ${symbol}`);
      const existingRecord = await this.stockModel.findOne({ Symbol: symbol });

      // There are two times when we might want to update the company overview:
      // when it's not already there, or about once a month. Rather than set a
      // cron job, just update all of the overviews on the first of the month.
      const today = new Date().getUTCDate();
      if (!existingRecord || today == 1) {
        this.updateQueue.push({
          updateType: UpdateType.OVERVIEW,
          symbol: symbol,
        });
        Logger.debug(`Queued overview update for ${symbol}`);
        numUpdates++;
      }

      // If we should run a time series update, queue one
      if (this.checkTimeSeriesUpdate(existingRecord, forceTimeSeries)) {
        numUpdates++;
        this.updateQueue.push({
          updateType: UpdateType.TIME_SERIES,
          symbol: symbol,
        });
      }
    }
    this.startUpdate();
    return numUpdates;
  }

  /**
   * Check whether the time series data for a stock should update
   * 
   * Ideally, we should update if the data is older than the most recent market
   * close, but the current data model doesn't track market hours for individual
   * securities. NYSE after-hours trading closes at 20:00 ET, which lines up
   * neatly with a 01:00Z refresh time---it's an hour after close in summer, and
   * at-close in winter. This results in a mostly rational update schedule for
   * European markets, too. With a once-per-day cron job, somebody's bound to be
   * off-kilter no matter what; with this scheme, it's the Asian markets, but I
   * don't think AlphaVantage gives us data for them, anyway.
   */
  private checkTimeSeriesUpdate(
    existingRecord: Stock & { _id: unknown; },
    force: boolean
  ): boolean {
    const symbol = existingRecord.Symbol;
    Logger.debug(`Evaluating time series update for ${symbol}:`);
    let updateTimeSeries = false;
    if (!existingRecord) {
      Logger.debug(`Queued time series update for new stock ${symbol}`);
      updateTimeSeries = true;
    } else if (force) {
      Logger.debug(`Force-updating time series for ${symbol}`);
      updateTimeSeries = true;
    } else {
      const today = new Date().getUTCDay();
      // Assume our data is from NYSE after-hours close, Eastern time. Append
      // that time to the date stamp, then convert to UTC so we can get a date
      let timestamp = existingRecord.priceHistory[0].timestamp + 'T20:00:00';
      timestamp = moment.tz(timestamp, 'America/New_York').utc().format();
      Logger.debug(`Most recent timestamp for ${symbol} was ${timestamp}.`);
      const lastUpdateDay = new Date(timestamp).getUTCDay();
      switch (today) {
        // For the weekend
        case 0: // Saturday (Sunday morning, UTC)
        case 1: // Sunday (Monday morning, UTC)
          updateTimeSeries = (lastUpdateDay != 6);
          Logger.debug(
            `It's the weekend. This update ${(force) ? 'is' : 'is not'} forced.`
            + ` ${symbol} ${(updateTimeSeries) ? 'will' : 'won\'t'} update`
          );
          break;
        default: // For the rest of the week, just check if we've updated today
          updateTimeSeries = (lastUpdateDay != today);
          Logger.debug(
            `It's a weekday. This update ${(force) ? 'is' : 'is not'} forced.`
            + ` ${symbol} ${(updateTimeSeries) ? 'will' : 'won\'t'} update`
          );
      }
    }
    return updateTimeSeries;
  }

  startUpdate(force = false): void {
    const updateJob = this.schedulerRegistry.getCronJob(UPDATE_JOB_NAME);
    if (force) {
      this.populateUpdateQueue(true)
        .then(numUpdates => Logger.log(`Queued ${numUpdates} updates`));
    } else if (!updateJob.running) {
      updateJob.start();
      Logger.debug('Starting update job.');
    };
  }

  stopUpdate(complete = false): void {
    const updateJob = this.schedulerRegistry.getCronJob(UPDATE_JOB_NAME);
    if (updateJob.running) {
      updateJob.stop();
      if (!complete) this.updateQueue = []; // Force clear the update queue
      const updateState = (complete) ? 'complete' : 'stopped';
      const nextUpdate = this.schedulerRegistry
        .getCronJob(REPOPULATE_JOB_NAME)
        .nextDate()
        .toISOString();
      Logger.log(`Update ${updateState}. Next update at ${nextUpdate}`)
    }
  }

  /**
   * This code executes the appropriate update action at each update tick
   */
  async runNextUpdate(): Promise<void> {
    if (this.updateQueue.length == 0) {
      this.stopUpdate(true);
      return;
    }
    const updateSpec = this.updateQueue.shift();
    let success: boolean;
    switch (updateSpec.updateType) {
      // A switch statement here allows us to expand the update cycle as the
      // data model evolves. We switch on the string value for readability.
      case UpdateType.OVERVIEW:
        Logger.debug(`Running overview update for ${updateSpec.symbol}`);
        await this.runOverviewUpdate(updateSpec.symbol);
        success = true; // If we got here without flinging errors, all is well
        break;
      case UpdateType.TIME_SERIES:
        Logger.debug(`Running time series update for ${updateSpec.symbol}`);
        success = await this.runTimeSeriesUpdate(updateSpec.symbol);
        break;
      case UpdateType.DEFER:
        Logger.debug('Deferred update for front-end request');
        break;
      default:
        // This should be unreachable, because enums, but it doesn't hurt
        throw new RangeError('Invalid update type');
    }
    Logger.debug(`Update ${(success) ? 'was' : 'was not'} successful.`)
  }

  /**
   * Let the client know if it can make an API call to the upstream provider.
   * Since we run against a limited third-party API, we push (technically,
   * 'unshift', since it goes to the front) a deferment to the update queue if
   * it's not empty. Either way, we hard limit the client to four calls for the
   * sixty-second timeout starting with the first request.
   */
  async upstreamSearch(keyword: string): Promise<SearchResults> {
    if (!this.frontendCanRequest)
      return { success: false, reason: 'Over call limit' };
    const queryUri = 'https://alphavantage.co/query?function=SYMBOL_SEARCH';
    // make the request and parse the results
    const response = await firstValueFrom(
      this.httpService.get(queryUri, {
        params: {
          keywords: keyword,
          apikey: config.upstreamAPI.key,
          datatype: 'csv',
        },
      })
    );
    const results: Match[] = csv.parse(response.data, {
      columns: true,
      cast: (value, context) => {
        if (context.header) return value;
        if (context.column === 'matchScore') {
          return Number.parseFloat(value);
        } else {
          return value;
        }
      },
    });

    this.deferNextUpdate();

    return { success: true, matches: results };
  }

  deferNextUpdate(): void {
    // If we have updates queued, defer the next one
    if (this.updateQueue.length > 0)
      this.updateQueue.unshift({ updateType: UpdateType.DEFER, symbol: '' });

    // If this is the first update since the count reset, start the reset timer
    if (this.frontendRequestCount == 0)
      setTimeout(() => {
        this.frontendCanRequest = true;
        this.frontendRequestCount = 0;
      }, 60000);

    // Count this request against our requests/minute limit
    this.frontendRequestCount++;
    const frontendCallLimit = 4; // Real call limit - 1 (for headroom)
    if (this.frontendRequestCount < frontendCallLimit) {
      Logger.debug('Accepted frontend request deferment');
    } else {
      Logger.debug('Frontend requests/minute reached.');
      this.frontendCanRequest = false;
    }
  }

  async addStock(
    symbol: string
  ): Promise<{ success: boolean; message: string }> {
    const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
    if (existingRecord) {
      return { success: false, message: 'Stock already exists' };
    } else if (!this.frontendCanRequest || this.frontendRequestCount >= 2) {
      const message =
        'Adding stock would exceed call limit. Please try again in one minute.';
      return { success: false, message: message };
    } else {
      try {
        this.deferNextUpdate();
        await this.runOverviewUpdate(symbol);
        this.deferNextUpdate();
        const timeResult = await this.runTimeSeriesUpdate(symbol);
        return { success: timeResult, message: 'Stock added successfully' };
      } catch (error) {
        let message = 'Something went wrong on our end'
        if (error.name === 'ValidationError') {
          message = `${symbol} does not appear to exist upstream`;
          Logger.debug('Caught validation error while adding stock');
          Logger.debug(`  Stock ${message}`);
        } else {
          Logger.debug('Unexpected error while adding stock');
          Logger.debug(`  Type: ${error.name}`);
          Logger.debug(`  Message: ${error.message}`);
        }
        return { success: false, message: message }
      }
    }
  }

  /**
   * Update company overview information
   *
   * For now, we only update company overview data when the company doesn't yet
   * exist in the database.
   */
  async runOverviewUpdate(symbol: string): Promise<void> {
    const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
    if (existingRecord) {
      Logger.debug(`Overview update found existing record for ${symbol}`);
    } else {
      const queryUri = 'https://alphavantage.co/query?function=OVERVIEW';
      const response = await firstValueFrom(
        this.httpService.get(queryUri, {
          params: {
            symbol: symbol,
            apikey: config.upstreamAPI.key,
          },
        })
      );
      const overviewData = response.data;
      await this.stockModel.insertMany(overviewData);
      Logger.debug(`Added ${overviewData.Name} to the database`);
    }
  }

  /**
   * Update stock price history array
   *
   * For now, we're just overwriting the existing price history. This has two
   * advantages: (a) we're running the current application against a MongoDB
   * Atlas test cluster with a whopping 512MB of storage, so overwriting is more
   * space-efficient; (b) frankly, it's easier.
   */
  async runTimeSeriesUpdate(symbol: string): Promise<boolean> {
    const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
    if (!existingRecord) return false;
    const queryUri =
      'https://alphavantage.co/query?function=TIME_SERIES_DAILY';
    const response = await firstValueFrom(
      this.httpService.get(queryUri, {
        params: {
          symbol: symbol,
          interval: '30min',
          outputsize: 'full',
          datatype: 'csv',
          apikey: config.upstreamAPI.key,
        },
      })
    );
    const timeSeriesData = csv.parse(response.data, {
      columns: true,
      cast: (value, context) => {
        if (context.header) return value;
        if (context.column === 'timestamp') {
          return value;
        } else {
          return Number.parseFloat(value);
        }
      },
    });
    existingRecord.priceHistory = timeSeriesData;
    await existingRecord.save();
    return true;
  }
}
