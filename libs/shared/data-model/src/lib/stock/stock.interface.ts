import { IntervalInterface } from './interval.interface';

export interface StockInterface {
  Symbol: string;
  Name: string;
  Industry: string;
  EPS: number;
  SharesOutstanding?: number;
  priceHistory?: IntervalInterface[];
}
