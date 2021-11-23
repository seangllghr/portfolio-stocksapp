import { IntervalInterface } from './interval.interface';

export interface Stock {
  symbol: string;
  name: string;
  sharesOutstanding: number;
  priceHistory: IntervalInterface[];
}
