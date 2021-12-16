import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Stock, StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { BackendService } from './backend.service';

export class StockDetailState {
  _selectedStock: Stock;
  showStockDetail: boolean;

  get selectedStock(): Stock {
    return this._selectedStock;
  }

  set selectedStock(stock: StockInterface) {
    this._selectedStock = new Stock(stock);
  }

  constructor(stock?: Stock) {
    this._selectedStock = new Stock(stock) || new Stock();
    this.showStockDetail = stock ? true : false;
  }
}

export enum MenuAction {
  'BACK',
  'ADD',
  'DELETE',
  'REFRESH'
}

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private stockDetailState = new StockDetailState();
  private menuAction = new Subject<MenuAction>();
  private stockSelection = new Subject<StockDetailState>();
  appMainTitle = 'WebSTOCKS';

  constructor(
    private backend: BackendService,
    private location: Location,
    private router: Router,
    private title: Title
  ) {}

  getStockSelection(): StockDetailState {
    return this.stockDetailState;
  }

  async setStockSelection(symbol: string): Promise<void> {
    // If the Symbol matches an existing stock (it should), pick that one
    let newStock = new Stock();
    try {
      newStock = await firstValueFrom(this.backend.getStock(symbol));
      this.router.navigate(['stock', `${symbol}`]);
      this.title.setTitle(`${this.appMainTitle} — ${symbol}`);
    } catch (err) {
      this.router.navigate(['404']);
    }
    this.stockDetailState = new StockDetailState(newStock);
    this.stockSelection.next(this.stockDetailState);
  }

  unsetStockSelection(): void {
    this.stockDetailState = new StockDetailState();
    this.router.navigate(['/']);
    this.title.setTitle(this.appMainTitle);
    this.stockSelection.next(this.stockDetailState);
  }

  onSelectStock(): Observable<StockDetailState> {
    return this.stockSelection.asObservable();
  }

  setMenuAction(action: MenuAction): void {
    switch (action) {
      case MenuAction.BACK:
        this.location.back();
        this.title.setTitle(this.appMainTitle);
        break;
      case MenuAction.ADD:
        this.router.navigate(['add']);
        this.title.setTitle(`${this.appMainTitle} — Add Stock`);
        break;
      case MenuAction.DELETE:
        this.backend
          .deleteStock(this.stockDetailState.selectedStock.Symbol)
          .subscribe(() => {
            this.router.navigate(['/']);
            this.menuAction.next(action);
          });
        break;
      case MenuAction.REFRESH:
        this.menuAction.next(action);
        break;
    }
  }

  onMenuAction(): Observable<MenuAction> {
    return this.menuAction.asObservable();
  }
}
