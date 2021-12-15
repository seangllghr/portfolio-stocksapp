import { Component, OnInit } from '@angular/core';
import { IntervalInterface as Interval, StockInterface as Stock } from '@portfolio-stocksapp/shared-data-model';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import { UiService } from '../../services/ui.service';

interface ChartData {
  times: string[];
  data: Array<Array<number>>;
  volumes: number[];
}

@Component({
  selector: 'webstocks-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  chart: ECharts | null = null;

  constructor(private ui: UiService) {
    this.ui.onSelectStock().subscribe(state => {
      this.updateChartData(state.selectedStock);
    })
  }

  ngOnInit(): void {
    const state = this.ui.getStockSelection();
    const elem = document.getElementById('chart');
    if (elem) this.chart = echarts.init(elem);
    if (!this.chart)
      throw Error('Chart failed to initialize correctly.');
    this.chart.setOption(INIT_OPTIONS);
    this.updateChartData(state.selectedStock);
  }

  /**
   * This function transforms an array of raw `Interval` objects into the
   * appropriate format for ECharts: an array of timestamp strings, an array of
   * four-element price arrays, of the form [open, close, low, high], and an
   * array of volumes.
   *
   * @param {Interval[]} priceHistory - an array of price interval data
   *
   * @returns {ChartData} the processed data, ready for use in the chart
   */
  transformChartData(priceHistory: Interval[]): ChartData {
    const times: string[] = [];
    const data: Array<Array<number>> = [];
    const volumes: number[] = [];
    for (const interval of priceHistory) {
      times.unshift(interval.timestamp);
      data.unshift([
        interval.open,
        interval.close,
        interval.low,
        interval.high
      ]);
      volumes.push(interval.volume);
    }

    return { times, data, volumes }
  }

  /**
   * Update the chart options object with new data
   *
   * @param {Stock} stock - the current stock, whose chart should be shown
   */
  updateChartData(stock: Stock) {
    const { times, data } = this.transformChartData(stock.priceHistory);
    if (this.chart) this.chart.setOption({
      xAxis: { data: times },
      series: [{
        name: stock.Symbol,
        data: data,
      }],
      dataZoom: [{ startValue: data.length - 60 }]
    })
  }

}

const INIT_OPTIONS = {
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
    show: false,
  },
  series: [{
    type: 'candlestick',
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
      end: 100,
    }
  ]
}
