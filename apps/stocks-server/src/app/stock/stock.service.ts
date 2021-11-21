import { Injectable } from '@nestjs/common';
import { Stock } from '@portfolio-stocksapp/data';

@Injectable()
export class StockService {
  private stocks: Stock[] = [];

  create(stock: Stock) {
    this.stocks.push(stock);
  }

  findBySymbol(symbol: string) {
    for (const stock of this.stocks) {
      if (stock.symbol === symbol) {
        return stock;
      }
    }
  }

  update(symbol: string, updateObject: Object) {
    const stock = this.findBySymbol(symbol)
    for (const field in updateObject) {
      stock[field] = updateObject[field];
    }
    this.deleteStock(symbol);
    this.stocks.push(stock);
    return stock;
  }

  deleteStock(symbol: string) {
    for (let i = 0; i < this.stocks.length; i++) {
      if (this.stocks[i].symbol === symbol) {
        this.stocks.splice(i, 1);
        return
      }
    }
  }
}
