import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import * as config from '../../assets/config.json';
import { Stock } from '../stock/schemas/stock.schema';

@Injectable()
export class MarketSyncService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>,
    private httpService: HttpService
  ) {}

  private readonly symbols: string[] = ['TSLA', 'AAPL', 'GOOG', 'IBM', ];
  private currentSymbolIdx: number = 0;
  private updateSteps: string[] = ['overview', 'time series']
  private currentStepIdx: number = 0;

  /**
   * Declare an update task with a tick rate of one per 12 seconds (5/min).
   *
   * NOTE: AlphaVantage, the API we're using for market data, has a limit of
   * 5 API calls per minute at its free tier. Thus, our update service is built
   * around this limitation. For a production system, this could be relaxed.
   */
  @Cron('*/12 * * * * *')
  runUpdateTask(): void {
    this.runNextUpdate();
  }

  /**
   * This code executes the appropriate update action at each update tick
   */
  async runNextUpdate(): Promise<void> {
    const currentStep = this.updateSteps[this.currentStepIdx]
    const currentSymbol = this.symbols[this.currentSymbolIdx]
    switch (currentStep) {
      // A switch statement here allows us to expand the update cycle as the
      // data model evolves. We switch on the string value for readability.
      case 'overview':
        await this.runOverviewUpdate(currentSymbol);
        this.currentStepIdx++;
        break;
      case 'time series':
        await this.runTimeSeriesUpdate(currentSymbol);
        this.currentStepIdx = 0;
        this.currentSymbolIdx =
          (this.currentSymbolIdx < this.symbols.length - 1)
          ? this.currentSymbolIdx + 1
          : 0;
        break;
      default:
        const errorMessage = `'${currentStep}' is not a valid update step.`
          + ` Valid steps are: '${this.updateSteps.join(', ')}'`;
        throw new RangeError(errorMessage);
    }
  }

  /**
   * Update company overview information
   *
   * For now, we only update company overview data when the company doesn't yet
   * exist in the database.
   */
  async runOverviewUpdate(symbol: string): Promise<void> {
    const existingRecord = await this.stockModel.findOne({Symbol: symbol})
    if (existingRecord) {
      Logger.debug(`Overview update found existing record for ${symbol}`);
    } else {
      const queryString = 'https://alphavantage.co/query?function=OVERVIEW'
        + `&symbol=${symbol}`
        + `&apikey=${config.upstreamAPI.key}`;
      const response = await firstValueFrom(this.httpService.get(queryString))
      const overviewData = response.data
      await this.stockModel.insertMany(overviewData)
      Logger.debug(`Added ${overviewData.Name} to the database`)
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
    Logger.debug(`Time Series update: ${symbol}`)
  }

}
