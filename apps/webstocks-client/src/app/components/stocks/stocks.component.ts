import { Component, Input } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent {
  @Input() filter = '';
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  stockSubscription: Subscription;

  constructor(
    private backend: BackendService,
    private uiService: UiService
  ) {
    this.stockSubscription = this.backend
      .getStocks()
      .subscribe((stocks) => {
        this.stocks = stocks;
        this.updateFilteredList();
      });
    // The only time menu actions get here is when the stock list changes
    this.uiService.onMenuAction().subscribe(() => this.refreshStocks());
  }

  refreshStocks(): void {
    this.stockSubscription.unsubscribe();
    this.stocks = [];
    this.updateFilteredList();
    this.stockSubscription = this.backend
      .getStocks()
      .subscribe((stocks) => {
        this.stocks = stocks;
        this.updateFilteredList();
      });
  }

  onSelectStock(stock: Stock): void {
    this.uiService.setStockSelection(stock.Symbol);
  }

  onFilterChange(filter: string): void {
    this.filter = filter.toUpperCase();
    this.updateFilteredList();
  }

  updateFilteredList(): void {
    if (this.filter !== '') {
      this.filteredStocks =
        this.stocks.filter((stock) => (stock.Symbol.includes(this.filter)));
    } else {
      this.filteredStocks = this.stocks;
    }
  }
}
