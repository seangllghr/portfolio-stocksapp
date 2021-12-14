import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { ECharts, EChartsOption } from 'echarts';
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
  options: EChartsOption = BASE_OPTIONS;
  updateOptions: unknown;
  chart: ECharts | null = null;

  constructor(private ui: UiService) {
    this.stockDetailState = this.ui.getStockSelection();
    this.ui.onSelectStock().subscribe(state => {
      this.stockDetailState = state;
      this.updateChartData();
    })
  }

  ngOnInit(): void {
    const elem = document.getElementById('chart');
    if (elem) this.chart = echarts.init(elem);
    if (!this.chart)
      throw Error('Chart failed to initialize correctly.')
    this.transformChartData();
    this.chart.setOption({
      backgroundColor: '#1d2021',
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
      yAxis: {
        scale: true,
        position: 'right',
        splitLine: {
          lineStyle: {
            color: ['#504945']
          }
        },
        axisLabel: {
          color: '#bdae93'
        }
      },
      grid: {
        top: 10,
        left: 5,
        right: 40,
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: this.times,
        show: false,
      },
      series: [{
        name: this.stockDetailState.selectedStock.Symbol,
        type: 'candlestick',
        data: this.data,
        itemStyle: {
          color: '#b8bb26',
          color0: '#fb4934',
          borderColor: '#98971a',
          borderColor0: '#cc241d',
        }
      }],
      dataZoom: [
        {
          type: 'inside',
          startValue: this.data.length - 60,
          end: 100,
        }
      ]
    })
  }

  transformChartData() {
    this.data = []
    this.times = []
    this.volumes = []
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

  updateChartData() {
    this.transformChartData();
    if (this.chart) this.chart.setOption({
      xAxis: { data: this.times },
      series: [{
        name: this.stockDetailState.selectedStock.Symbol,
        data: this.data,
      }],
      dataZoom: [{ startValue: this.data.length - 60 }]
    })
  }

}

const BASE_OPTIONS: EChartsOption = {
}
