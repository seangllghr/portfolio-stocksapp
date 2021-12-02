import { StockInterface } from '@portfolio-stocksapp/shared-data-model';

export const STOCKS: StockInterface[] = [
  {
    priceHistory: [
      {
        timestamp: "2021-12-01",
        open: 2884.25,
        high: 2929.98,
        low: 2830,
        close: 2832.36,
        volume: 1422445
      },
      {
        timestamp: "2021-11-30",
        open: 2909.005,
        high: 2932.57,
        low: 2841.32,
        close: 2849.04,
        volume: 2079526
      },
      {
        timestamp: "2021-11-29",
        open: 2885.97,
        high: 2937.24,
        low: 2885.97,
        close: 2922.28,
        volume: 1313806
      }
    ],
    SharesOutstanding: 317738000,
    EPS: 103.81,
    Industry: "SERVICES-COMPUTER PROGRAMMING, DATA PROCESSING, ETC.",
    Name: "Alphabet Inc",
    Symbol: "GOOG",
  },
  {
    priceHistory: [
      {
        timestamp: "2021-12-01",
        open: 167.48,
        high: 170.3,
        low: 164.53,
        close: 164.77,
        volume: 149316372
      },
      {
        timestamp: "2021-11-30",
        open: 159.985,
        high: 165.52,
        low: 159.92,
        close: 165.3,
        volume: 174048056
      },
      {
        timestamp: "2021-11-29",
        open: 159.37,
        high: 161.19,
        low: 158.7901,
        close: 160.24,
        volume: 88748217
      }
    ],
    SharesOutstanding: 16406400000,
    EPS: 5.61,
    Industry: "ELECTRONIC COMPUTERS",
    Name: "Apple Inc",
    Symbol: "AAPL",
  },
  {
    priceHistory: [
      {
        timestamp: "2021-12-01",
        open: 118.25,
        high: 118.93,
        low: 116.85,
        close: 116.92,
        volume: 5955827
      },
      {
        timestamp: "2021-11-30",
        open: 117.5,
        high: 119.2399,
        low: 116.45,
        close: 117.1,
        volume: 9252701
      },
      {
        timestamp: "2021-11-29",
        open: 118.62,
        high: 119.61,
        low: 117.53,
        close: 118.5,
        volume: 8949795
      }
    ],
    SharesOutstanding: 896320000,
    EPS: 5.28,
    Industry: "COMPUTER & OFFICE EQUIPMENT",
    Name: "International Business Machines Corporation",
    Symbol: "IBM",
  }
]
