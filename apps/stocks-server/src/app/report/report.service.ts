import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockDocument } from '../stock/schemas/interval.schema';
import { Stock } from '../stock/schemas/stock.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>
  ) {}

  async generateIndustryReport(industry: string) {
    const pipeline = [
      { $match: { 'industry': industry } },
      { $sort: { 'eps': -1 } },
      { $limit: 5 }
    ]
    return await this.stockModel.aggregate(pipeline)
  }

  async generateStockReport(symbols: string[]) {
    return await this.stockModel.find({ symbol: {$in: symbols} })
  }

}
