import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Stock, StockDocument } from './schemas/stock.schema';
import { StockInterface } from '@portfolio-stocksapp/data';

@Injectable()
export class StockService {
  constructor(@InjectModel(Stock.name) private stockModel: Model<StockDocument>) {}

  async create(stock: StockInterface): Promise<Stock> {
    if (await this.stockModel.findOne({ "symbol": stock.symbol })) {
      throw new BadRequestException("Stock already exists.")
    }
    const createdStock = new this.stockModel(stock);
    return createdStock.save();
  }

  async findBySymbol(symbol: string) {
    const result = await this.stockModel.findOne({ "symbol": symbol });
    if (result) {
      return result
    } else {
      throw new NotFoundException("Stock does not appear in our records.")
    }
  }

  async update(symbol: string, updateObject: Object) {
    const result = await this.stockModel.updateOne(
      { "symbol": symbol },
      updateObject
    );
    if (result.modifiedCount > 0) {
      return result;
    } else if (result.matchedCount > 0) {
      return result;
    } else {
      throw new NotFoundException("Stock does not appear in our records.")
    }
  }

  async deleteStock(symbol: string) {
    const result = await this.stockModel.deleteOne({ "symbol": symbol });
    if (result.deletedCount > 0) {
      return result;
    } else {
      const errString = "Good news! That ticker is already gone! "
        + "Or maybe it was never here?"
      throw new NotFoundException(errString);
    }
  }
}
