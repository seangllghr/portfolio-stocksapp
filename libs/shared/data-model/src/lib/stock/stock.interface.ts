import { IntervalInterface } from './interval.interface';

export interface StockInterface {
  symbol: string;
  name: string;
  industry: string;
  eps: number;
  sharesOutstanding?: number;
  priceHistory?: IntervalInterface[];
}
