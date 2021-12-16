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

  constructor(stock?: StockInterface) {
    this.Symbol = (stock) ? stock.Symbol : "";
    this.Name = (stock) ? stock.Name : "";
    this.Industry = (stock) ? stock.Industry : "";
    this.EPS = (stock) ? stock.EPS : 0;
    this.priceHistory = (stock) ? stock.priceHistory : [];
  }

  /**
   * Gets the stock's last closing price, as well as its gain/loss over the
   * previous day and percent change.
   *
   * @returns An object containing:
   * - price - the last closing price of the stock
   * - gain - true if the stock did not fall in price from yesterday
   * - delta - the percentage difference from the previous day
   */
  get lastClose(): { price: number, gain: boolean, delta: string } {
    const price =
      this.priceHistory.length > 0 ? this.priceHistory[0].close : 0;
    let gain = true;
    let delta = '';
    if (this.priceHistory.length > 1) {
      // calculate daily percent change: ((P_old-P_new)/P_old)*100
      let deltaResult =
        this.priceHistory[0].close - this.priceHistory[1].close;
      deltaResult = (deltaResult / this.priceHistory[1].close) * 100;
      gain = (deltaResult >= 0);
      delta = deltaResult.toFixed(2);
    }
    return { price, gain, delta };
  }

}
