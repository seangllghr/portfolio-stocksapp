import { Component, OnInit } from '@angular/core';
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks: StockInterface[] = [];

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.getStocks().subscribe((stocks) => this.stocks = stocks);
  }

}
