import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Stock, StockDocument } from './schemas/stock.schema';
import { StockInterface } from '@portfolio-stocksapp/data';

@Injectable()
export class StockService {
  constructor(@InjectModel(Stock.name) private stockModel: Model<StockDocument>) {}

  async create(stock: StockInterface): Promise<Stock> {
    const createdStock = new this.stockModel(stock);
    return createdStock.save();
  }

  async findBySymbol(symbol: string) {
    return this.stockModel.find({ "symbol": symbol });
  }

  update(symbol: string, updateObject: Object) {
    return
  }

  async deleteStock(symbol: string) {
    return this.stockModel.deleteOne({ "symbol": symbol });
  }
}
