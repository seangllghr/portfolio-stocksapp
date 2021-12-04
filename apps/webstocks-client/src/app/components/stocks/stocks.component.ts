import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui-service.service';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  selectedStock: Stock = new Stock();

  constructor(
    private stockService: StockService,
    private uiService: UiService,
  ) {}

  ngOnInit(): void {
    this.stockService.getStocks().subscribe((stocks) => this.stocks = stocks);
  }

  onSelectStock(stock: Stock) {
    this.uiService.setStockSelection(stock.Symbol);
  }

}
