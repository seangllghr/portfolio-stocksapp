import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { StockDocument } from '../stock/schemas/interval.schema';
import { Stock } from '../stock/schemas/stock.schema';

@Injectable()
export class MarketSyncService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>
  ) {}

  private readonly symbols: string[] = ['AAPL', 'GOOG', 'IBM'];
  private currentSymbol: number = 0;
  private updateSteps: string[] = ['overview', 'time series']
  private currentStep: number = 0;

  /**
   * Declare an update task with a tick rate of 5 per minute.
   *
   * NOTE: AlphaVantage, the API we're using for market data, has a limit of
   * 5 API calls per minute at its free tier. Thus, our update service is built
   * around this limitation. For a production system, this could be relaxed.
   */
  @Cron('*/5 * * * * *')
  runUpdateTask() {
    this.runNextUpdate();
  }

  /**
   * This code executes the appropriate update action at each update tick
   */
  async runNextUpdate() {
    switch (this.updateSteps[this.currentStep]) {
      // A switch statement here allows us to expand the update cycle as the
      // data model evolves. We switch on the string value for readability.
      case 'overview':
        await this.runOverviewUpdate();
        this.currentStep++
        break;
      case 'time series':
        await this.runTimeSeriesUpdate();
        this.currentStep = 0;
        this.currentSymbol = (this.currentSymbol < this.symbols.length - 1)
          ? this.currentSymbol + 1
          : 0;
        break;
      default:
        const errorMessage = `'${this.updateSteps[this.currentStep]}'`
          + ' is not a valid update step.'
          + ` Valid steps are: '${this.updateSteps.join(', ')}'`
        throw new RangeError(errorMessage)
    }
  }

  async runOverviewUpdate() {
    const existingRecord = await this.stockModel.findOne({
      symbol: this.symbols[this.currentSymbol]
    })
    console.log(`Overview update found company: ${existingRecord}`)
  }

  async runTimeSeriesUpdate() {
    console.log(`Time Series update: ${this.symbols[this.currentSymbol]}`)
  }

}
