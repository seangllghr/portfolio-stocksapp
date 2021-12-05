import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui-service.service';

@Component({
  selector: 'webstocks-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  showStockDetail = false;
  stock = new Stock();
  collapse = false;
  lastClose = { price: 0, trend: true, delta: '0' }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private uiService: UiService
  ) {
    this.route.paramMap.subscribe(params => {
      this.uiService.setStockSelection(params.get('Symbol') || '')
    })
  }

  ngOnInit(): void {
    this.uiService.onSelectStock().subscribe((state) => {
      this.showStockDetail = state.showStockDetail;
      this.stock = state.selectedStock;
      this.lastClose = this.setLastClose()
    })
  }

  closeStockDetail() {
    this.router.navigate(['/']);
  }

  toggleCollapseDetail() {
    this.collapse = !this.collapse;
  }

  setLastClose(): {price: number, trend: boolean, delta: string} {
    const price =
      (this.stock.priceHistory.length > 0) ? this.stock.priceHistory[0].close : 0;
    let trend = true;
    let delta = '';
    if (this.stock.priceHistory.length > 1) {
      // calculate daily percent change: ((P_old-P_new)/P_old)*100
      let deltaResult = (this.stock.priceHistory[0].close - this.stock.priceHistory[1].close)
      deltaResult = deltaResult/ this.stock.priceHistory[1].close * 100;
      trend = !(deltaResult < 0);
      delta = deltaResult.toFixed(2);
    }
    return { price, trend, delta }
  }

}
