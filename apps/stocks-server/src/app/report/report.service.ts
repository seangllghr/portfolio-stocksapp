import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from '../stock/schemas/stock.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>
  ) {}

  /**
   * Generate a report with the top five companies in a given industry
   * @param industry - the industry to generate the report on
   * @returns an aggregated list of the top five companies in the industry
   */
  async generateIndustryReport(industry: string) {
    const pipeline = [
      { $match: { 'Industry': industry } },
      { $sort: { 'EPS': -1 } },
      { $limit: 5 }
    ]
    return await this.stockModel.aggregate(pipeline)
  }

  /**
   * Generate a report with data for the listed stocks
   * @param symbols a list of symbols to search
   * @returns an array of the stocks in the list
   */
  async generateStockReport(symbols: string[]) {
    return await this.stockModel.find({ Symbol: {$in: symbols} })
  }

}
