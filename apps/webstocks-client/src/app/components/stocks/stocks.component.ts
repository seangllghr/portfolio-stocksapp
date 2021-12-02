import { Component, OnInit } from '@angular/core';
import { STOCKS } from '../../../stocks-list'
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  stocks: StockInterface[] = STOCKS;

  constructor() { }

  ngOnInit(): void {
  }

}
