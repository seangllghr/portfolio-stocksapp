import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StockInterface as Stock } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-stocks-item',
  templateUrl: './stocks-item.component.html',
  styleUrls: ['./stocks-item.component.scss']
})
export class StocksItemComponent implements OnInit {
  @Input() stock!: Stock;
  @Output() selectStockEvent: EventEmitter<Stock> = new EventEmitter();
  lastPrice?: number;

  ngOnInit(): void {
    this.lastPrice = (this.stock.priceHistory)
      ? this.stock.priceHistory[0].close
      : -1;
  }

  onSelect() {
    this.selectStockEvent.emit(this.stock);
  }

}
