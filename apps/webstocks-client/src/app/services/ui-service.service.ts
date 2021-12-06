import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { StockService } from './stock.service';

export class StockDetailState {
  selectedStock: Stock;
  showStockDetail: boolean;

  constructor(stock?: Stock) {
    this.selectedStock = stock || new Stock();
    this.showStockDetail = (stock) ? true : false;
  }
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
  appMainTitle = 'WebSTOCKS';

  constructor(
    private stockService: StockService,
    private router: Router,
    private title: Title
  ) {
  }

  async setStockSelection(symbol: string): Promise<void> {
    // If the Symbol matches an existing stock (it should), pick that one
    let newStock = new Stock();
    try {
      newStock = await firstValueFrom(this.stockService.getStock(symbol));
      this.router.navigate(['stock', `${symbol}`])
      this.title.setTitle(`${this.appMainTitle} — ${symbol}`)
    } catch (err) {
      this.router.navigate(['404']);
    }
    this.stockDetailState = new StockDetailState(newStock);
    this.subject.next(this.stockDetailState);
  }

  unsetStockSelection(): void {
    this.stockDetailState = {
      selectedStock: new Stock(),
      showStockDetail: false
    }
    this.router.navigate(['/'])
    this.title.setTitle(this.appMainTitle)
    this.subject.next(this.stockDetailState)
  }

  onSelectStock(): Observable<StockDetailState> {
    return this.subject.asObservable();
  }

}
