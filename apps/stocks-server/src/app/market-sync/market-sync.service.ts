import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as csv from 'csv/sync';
import { firstValueFrom } from 'rxjs';
import * as config from '../../assets/config.json';
import { Stock } from '../stock/schemas/stock.schema';

enum UpdateType {
  Overview = 1,
  TimeSeries,
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

  /**
   * Declare a cron job to run the next update task in the queue.
   *
   * NOTE: AlphaVantage, the API we're using for market data, has a limit of
   * 5 API calls per minute at its free tier. Thus, our update service is built
   * around this limitation. For a production system, this could be relaxed.
   */
  @Cron('*/12 * * * * *', {
    name: updateJobName
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
    name: repopulateJobName
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

  /**
   * Populate update queue with update objects, to be processed by runNextUpdate
   */
  async populateUpdateQueue(): Promise<number> {
    // Stop the update job so we don't update before the list is filled
    this.schedulerRegistry.getCronJob(updateJobName).stop();
    if (this.updateQueue.length > 0) return 0; // return if queue not empty
    let numUpdates = 0;

    // Loop through the symbols array, locate each one in the database,
    // and add the appropriate update tasks to the queue.
    for (const symbol of config.stocks) {
      Logger.debug(`Queueing updates for ${symbol}`);
      const existingRecord = await this.stockModel.findOne({ Symbol: symbol });
      if (!existingRecord) {
        this.updateQueue.push({
          updateType: UpdateType.Overview,
          symbol: symbol,
        });
        Logger.debug(`Queued overview update for ${symbol}`);
        numUpdates++;
      }
      this.updateQueue.push({
        updateType: UpdateType.TimeSeries,
        symbol: symbol,
      });
      Logger.debug(`Queued time series update for ${symbol}`);
      numUpdates++;
    }
    this.schedulerRegistry.getCronJob(updateJobName).start();
    return numUpdates;
  }

  /**
   * This code executes the appropriate update action at each update tick
   */
  async runNextUpdate(): Promise<void> {
    if (this.updateQueue.length == 0) {
      const nextUpdate = this.schedulerRegistry
        .getCronJob(repopulateJobName)
        .nextDate()
        .toISOString()
      Logger.log(`Update complete. Next update at ${nextUpdate}`)
      this.schedulerRegistry.getCronJob(updateJobName).stop();
      return;
    }
    const updateSpec = this.updateQueue.shift();
    switch (updateSpec.updateType) {
      // A switch statement here allows us to expand the update cycle as the
      // data model evolves. We switch on the string value for readability.
      case UpdateType.Overview:
        await this.runOverviewUpdate(updateSpec.symbol);
        break;
      case UpdateType.TimeSeries:
        await this.runTimeSeriesUpdate(updateSpec.symbol);
        break;
      default:
        // This should be unreachable, because enums, but it doesn't hurt
        throw new RangeError('Invalid update type');
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
      const queryUri =
        'https://alphavantage.co/query?function=OVERVIEW' +
        `&symbol=${symbol}` +
        `&apikey=${config.upstreamAPI.key}`;
      const response = await firstValueFrom(this.httpService.get(queryUri));
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
        'https://alphavantage.co/query?function=TIME_SERIES_DAILY'
        + `&symbol=${symbol}`
        + '&interval=30min&outputsize=full&datatype=csv'
        + `&apikey=${config.upstreamAPI.key}`;
      const response = await firstValueFrom(this.httpService.get(queryUri));
      const timeSeriesData = csv.parse(response.data, {
        columns: true,
        cast: (value, context) => {
          if (context.header) return value;
          if (context.column === 'timestamp') {
            return Date.parse(value);
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
        updateType: UpdateType.TimeSeries,
        symbol: symbol,
      });
    }
  }
}
