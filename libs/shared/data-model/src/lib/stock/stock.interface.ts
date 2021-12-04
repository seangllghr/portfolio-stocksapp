import { IntervalInterface } from './interval.interface';

export interface StockInterface {
  Symbol: string;
  Name: string;
  Industry: string;
  EPS: number;
  SharesOutstanding?: number;
  priceHistory: IntervalInterface[];
}

export const blankStock = {
    Symbol: "",
    Name: "",
    Industry: "",
    EPS: 0,
    priceHistory: [],
  }

export class Stock implements StockInterface {
  Symbol: string;
  Name: string;
  Industry: string;
  EPS: number;
  SharesOutstanding?: number;
  priceHistory: IntervalInterface[];

  constructor() {
    this.Symbol = "";
    this.Name = "";
    this.Industry = "";
    this.EPS = 0;
    this.priceHistory = [];
  }

}
