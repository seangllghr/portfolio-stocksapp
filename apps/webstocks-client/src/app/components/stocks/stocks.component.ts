import { Component, Input } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { StockData } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent {
  @Input() filter = '';
  stocks: StockData[] = [];
  filteredStocks: StockData[] = [];
  stockSubscription: Subscription;

  constructor(
    private backend: BackendService,
    private ui: UiService
  ) {
    this.stockSubscription = this.backend
      .getStocks()
      .subscribe((stocks) => {
        this.stocks = stocks;
        this.updateFilteredList();
      });
    // The only time menu actions get here is when the stock list changes
    this.ui.onMenuAction().subscribe(() => this.refreshStocks());
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

  /**
   * Inform the UI service that a new stock has been selected
   *
   * @param {Stock} stock - the newly-selected stock
   */
  onSelectStock(stock: StockData): void {
    this.ui.setStockSelection(stock.Symbol);
  }

  /**
   * Update the stock list filter text, then call the filtering method
   *
   * @param {string} filter - the new filter text
   */
  onFilterChange(filter: string): void {
    this.filter = filter.toUpperCase();
    this.updateFilteredList();
  }

  /**
   * Validate that filter is not empty, then filter stock list accordingly
   */
  updateFilteredList(): void {
    if (this.filter !== '') {
      this.filteredStocks =
        this.stocks.filter((stock) => (stock.Symbol.includes(this.filter)));
    } else {
      this.filteredStocks = this.stocks;
    }
  }
}
