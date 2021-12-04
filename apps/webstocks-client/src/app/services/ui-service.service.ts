import { Injectable } from '@angular/core';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { Observable, of, Subject } from 'rxjs';
import { StockService } from './stock.service';

export interface StockDetailState {
  selectedStock: Stock,
  showStockDetail: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private stockDetailState: StockDetailState = {
    selectedStock: new Stock(),
    showStockDetail: false
  }
  private stocks: Stock[] = [];
  private subject = new Subject<StockDetailState>();

  constructor(private stockService: StockService) {
    this.stockService.getStocks().subscribe(stocks => {
      this.stocks = stocks;
    })
  }

  getStocks(): Stock[] {
    return this.stocks;
  }

  setStockSelection(symbol: string): void {
    // If the Symbol matches an existing stock (it should), pick that one
    this.stockDetailState.selectedStock =
      this.stocks.find((stock) => stock.Symbol === symbol)
      || new Stock();
    this.stockDetailState.showStockDetail = (symbol !== '');
    this.subject.next(this.stockDetailState);
  }

  onSelectStock(): Observable<StockDetailState> {
    return this.subject.asObservable();
  }

}
