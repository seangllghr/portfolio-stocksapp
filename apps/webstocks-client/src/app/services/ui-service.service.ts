import { Injectable } from '@angular/core';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { Observable, Subject } from 'rxjs';

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
  private subject = new Subject<StockDetailState>();

  setStockSelection(stock: Stock): void {
    this.stockDetailState.selectedStock = stock;
    this.stockDetailState.showStockDetail = true;
    this.subject.next(this.stockDetailState);
  }

  onSelectStock(): Observable<StockDetailState> {
    return this.subject.asObservable();
  }

}
