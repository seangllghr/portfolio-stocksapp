import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from '../stock/schemas/stock.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>
  ) {}

  async generateIndustryReport(industry: string) {
    const pipeline = [
      { $match: { 'Industry': industry } },
      { $sort: { 'EPS': -1 } },
      { $limit: 5 }
    ]
    return await this.stockModel.aggregate(pipeline)
  }

  async generateStockReport(symbols: string[]) {
    return await this.stockModel.find({ Symbol: {$in: symbols} })
  }

}
