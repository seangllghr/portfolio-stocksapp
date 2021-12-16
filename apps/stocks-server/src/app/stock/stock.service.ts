import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockData } from '@portfolio-stocksapp/shared-data-model';
import { Model } from 'mongoose';
import { Stock } from './schemas/stock.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>
  ) {}

  /**
   * Add a given stock to the database
   * @param stock a StockData object containing the stock to add
   * @returns a Stock schema object with an ID.
   */
  async create(stock: StockData) {
    if (await this.stockModel.findOne({ Symbol: stock.Symbol })) {
      throw new BadRequestException('Stock already exists.');
    }
    const createdStock = new this.stockModel(stock);
    return createdStock.save();
  }

  /**
   * Search for a specific stock in the database
   * @param symbol the symbol to search in the database
   * @returns the result as a Stock document and ID
   */
  async findBySymbol(symbol: string) {
    const result = await this.stockModel.findOne({ Symbol: symbol });
    if (result) {
      return result;
    } else {
      throw new NotFoundException('Stock does not appear in our records.');
    }
  }

  /**
   * Fetch the full list of stocks from the database
   * @returns all of the stocks
   */
  async findAll() {
    return await this.stockModel.find({});
  }

  /**
   * Manually update a stock with new data
   * @param symbol the ticker symbol of the stock to update
   * @param updateObject an object with fields to update and their new values
   * @returns the result of the update
   */
  async update(symbol: string, updateObject: unknown) {
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

  /**
   * Delete a stock from the database
   * @param symbol the ticker symbol of the stock to delete
   * @returns a count of the number of stocks deleted
   */
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
