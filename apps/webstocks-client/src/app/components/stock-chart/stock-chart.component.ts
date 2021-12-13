import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { StockDetailState, UiService } from '../../services/ui.service';

@Component({
  selector: 'webstocks-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  stockDetailState: StockDetailState;
  times: string[] = [];
  data: Array<Array<number>> = []; // each element is [open, close, low, high]
  volumes: number[] = [];
  options: EChartsOption = {};
  updateOptions: unknown;

  constructor(private ui: UiService) {
    this.stockDetailState = this.ui.getStockSelection();
    this.ui.onSelectStock().subscribe(state => {
      this.stockDetailState = state;
      this.setChartData();
    })
  }

  ngOnInit(): void {
    this.options = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1d2021',
        borderColor: '#ebdbb2',
        borderRadius: 0,
        textStyle: {
          color: '#ebdbb2',
        },
        extraCssText: 'font-variant: small-caps;'
      },
      xAxis: {
        type: 'category',
        data: this.times,
        show: false,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'datamin',
        max: 'dataMax',
      },
      yAxis: {
        scale: true,
        show: false,
        splitArea: { show: true },
      },
      grid: {
        top: 0,
        left: 25,
        right: 25,
        bottom: 0,
      },
      series: [
        {
          name: this.stockDetailState.selectedStock.Symbol,
          type: 'candlestick',
          data: this.data,
          itemStyle: {
            color: '#b8bb26',
            color0: '#fb4934',
            borderColor: '#98971a',
            borderColor0: '#cc241d',
          }
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          startValue: this.data.length - 60,
          end: 100,
        },
        {
          type: 'slider',
          show: false,
          startValue: this.data.length - 60,
          end: 100,
        }
      ]
    }
    this.setChartData();
  }

  setChartData() {
    for (const interval of this.stockDetailState.selectedStock.priceHistory) {
      this.times.unshift(interval.timestamp);
      this.data.unshift([
        interval.open,
        interval.close,
        interval.low,
        interval.high
      ]);
      this.volumes.push(interval.volume);
    }
  }

}
