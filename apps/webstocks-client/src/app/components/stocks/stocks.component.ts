import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui-service.service';
import { Subscription } from 'rxjs';
import { MenuAction } from '../menu/menu.component';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent {
  stocks: Stock[] = [];
  selectedStock: Stock = new Stock();
  stockSubscription: Subscription;

  constructor(
    private stockService: StockService,
    private uiService: UiService
  ) {
    this.stockSubscription = this.stockService.getStocks().subscribe((stocks) => (this.stocks = stocks));
    this.uiService.onMenuAction().subscribe((action) => {
      if (action === MenuAction.REFRESH) {
        this.refreshStocks();
      }
    })
  }

  refreshStocks():void {
    this.stockSubscription.unsubscribe();
    this.stocks = []
    this.stockSubscription = this.stockService.getStocks().subscribe((stocks) => (this.stocks = stocks));
  }

  onSelectStock(stock: Stock) {
    this.uiService.setStockSelection(stock.Symbol);
  }
}
