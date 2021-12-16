import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock, StockInterface } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-stocks-item',
  templateUrl: './stocks-item.component.html',
  styleUrls: ['./stocks-item.component.scss'],
})
export class StocksItemComponent {
  private _stock!: Stock;
  @Output() selectStockEvent: EventEmitter<Stock> = new EventEmitter();

  @Input()
  get stock(): Stock {
    return this._stock;
  }

  set stock(stockData: StockInterface) {
    // We use the setter here to initialize the stock data as a full Stock
    // object. This allows us to call class methods---and, by extension, to
    // access derived properties, like lastClose.
    this._stock = new Stock(stockData);
  }

  onSelect() {
    this.selectStockEvent.emit(this.stock);
  }
}
