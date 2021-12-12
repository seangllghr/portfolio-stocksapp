import { Component, Input, OnInit } from '@angular/core';
import { IntervalInterface as Interval } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  @Input() priceHistory: Interval[] = [];
  times:   string[] = [];
  opens:   number[] = [];
  highs:   number[] = [];
  lows:    number[] = [];
  closes:  number[] = [];
  volumes: number[] = [];

  ngOnInit(): void {
    for (const interval of this.priceHistory) {
      this.times.push(interval.timestamp);
      this.opens.push(interval.open);
      this.highs.push(interval.high);
      this.lows.push(interval.low);
      this.closes.push(interval.close);
      this.volumes.push(interval.volume);
    }
  }

}
