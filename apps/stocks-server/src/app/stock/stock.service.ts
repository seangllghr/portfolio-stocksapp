import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { Model } from 'mongoose';
import { Stock } from './schemas/stock.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>
  ) {}

  async create(stock: StockInterface) {
    if (await this.stockModel.findOne({ Symbol: stock.Symbol })) {
      throw new BadRequestException('Stock already exists.');
    }
    const createdStock = new this.stockModel(stock);
    return createdStock.save();
  }

  async findBySymbol(symbol: string) {
    const result = await this.stockModel.findOne({ Symbol: symbol });
    if (result) {
      return result;
    } else {
      throw new NotFoundException('Stock does not appear in our records.');
    }
  }

  async update(symbol: string, updateObject: Object) {
    const result = await this.stockModel.updateOne(
      { Symbol: symbol },
      updateObject
    );
    if (result.modifiedCount > 0) {
      return result;
    } else if (result.matchedCount > 0) {
      return result;
    } else {
      throw new NotFoundException('Stock does not appear in our records.');
    }
  }

  async deleteStock(symbol: string) {
    const result = await this.stockModel.deleteOne({ Symbol: symbol });
    if (result.deletedCount > 0) {
      return result;
    } else {
      const errString =
        'Good news! That ticker is already gone! ' +
        'Or maybe it was never here?';
      throw new NotFoundException(errString);
    }
  }
}
