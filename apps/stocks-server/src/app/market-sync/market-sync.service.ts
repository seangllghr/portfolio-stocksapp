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

enum UpdateType {
  OVERVIEW = 1,
  TIME_SERIES,
  DEFER,
}

interface UpdateObject {
  updateType: UpdateType;
  symbol: string;
}

const updateJobName = 'updateJob';
const repopulateJobName = 'repopulateJob';

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
    name: updateJobName,
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
  @Cron('0 20 * * *', {
    name: repopulateJobName,
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
  async populateUpdateQueue(): Promise<number> {
    // Stop the update job while we populate the list. We don't need the full
    // stop sequence here, so we call the SchedulerRegistry directly, rather
    // than use this.stopUpdate().
    this.schedulerRegistry.getCronJob(updateJobName).stop();
    if (this.updateQueue.length > 0) return 0; // return if queue not empty
    let numUpdates = 0;

    // Get the symbols array
    const stocks = await this.getStockList();

    // Loop through the symbols array, locate each one in the database,
    // and add the appropriate update tasks to the queue.
    for (const symbol of stocks) {
      Logger.debug(`Queueing updates for ${symbol}`);
      const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
      if (!existingRecord) {
        this.updateQueue.push({
          updateType: UpdateType.OVERVIEW,
          symbol: symbol,
        });
        Logger.debug(`Queued overview update for ${symbol}`);
        numUpdates++;
      }
      this.updateQueue.push({
        updateType: UpdateType.TIME_SERIES,
        symbol: symbol,
      });
      Logger.debug(`Queued time series update for ${symbol}`);
      numUpdates++;
    }
    this.startUpdate();
    return numUpdates;
  }

  startUpdate(full = false): void {
    const updateJob = this.schedulerRegistry.getCronJob(updateJobName);
    if (full) {
      this.populateUpdateQueue();
    } else if (~updateJob.running) {
      updateJob.start();
      Logger.debug('Starting update job.');
    };
  }

  stopUpdate(complete = false): void {
    const updateJob = this.schedulerRegistry.getCronJob(updateJobName);
    if (updateJob.running) {
      updateJob.stop();
      if (!complete) this.updateQueue = []; // Force clear the update queue
      const updateState = (complete) ? 'complete' : 'stopped';
      const nextUpdate = this.schedulerRegistry
        .getCronJob(repopulateJobName)
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
      this.stopUpdate();
      return;
    }
    const updateSpec = this.updateQueue.shift();
    switch (updateSpec.updateType) {
      // A switch statement here allows us to expand the update cycle as the
      // data model evolves. We switch on the string value for readability.
      case UpdateType.OVERVIEW:
        await this.runOverviewUpdate(updateSpec.symbol);
        break;
      case UpdateType.TIME_SERIES:
        await this.runTimeSeriesUpdate(updateSpec.symbol);
        break;
      case UpdateType.DEFER:
        Logger.debug('Deferred update for front-end request');
        break;
      default:
        // This should be unreachable, because enums, but it doesn't hurt
        throw new RangeError('Invalid update type');
    }
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
        await this.runTimeSeriesUpdate(symbol);
        return { success: true, message: 'Stock added to update queue' };
      } catch (error) {
        let message = 'Something went wrong on our end'
        if (error.name === 'ValidationError') {
          message = `${symbol} does not appear to exist upstream`;
          Logger.debug('Caught validation error while updating stock overview');
          Logger.debug(`  Stock ${message}`);
        } else {
          Logger.debug('Unexpected error while updating stock overview');
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
  async runTimeSeriesUpdate(symbol: string): Promise<void> {
    const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
    if (existingRecord) {
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
      Logger.debug(`Updated time series for ${symbol}`);
    } else {
      Logger.debug(
        `${symbol} not found in local db. Deferring time series update.`
      );
      this.updateQueue.push({
        updateType: UpdateType.TIME_SERIES,
        symbol: symbol,
      });
    }
  }
}
