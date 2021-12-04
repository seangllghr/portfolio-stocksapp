import { Component, Input, OnInit } from '@angular/core';
import { Stock } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  @Input() stock!: Stock;

  constructor() { }

  ngOnInit(): void {
  }

}
