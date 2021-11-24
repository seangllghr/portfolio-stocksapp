import { IntervalInterface } from './interval.interface';

export interface StockInterface {
  symbol: string;
  name: string;
  sharesOutstanding?: number;
  priceHistory?: IntervalInterface[];
}
