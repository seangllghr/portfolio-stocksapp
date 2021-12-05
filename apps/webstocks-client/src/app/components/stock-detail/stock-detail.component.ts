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
  lastClose = { price: 0, trend: true }

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

  setLastClose(): {price: number, trend: boolean} {
    const price =
      (this.stock.priceHistory.length > 0) ? this.stock.priceHistory[0].close : 0;
    let trend = true;
    if (this.stock.priceHistory.length > 1) {
      trend = !(this.stock.priceHistory[0].close - this.stock.priceHistory[1].close < 0)
    }
    return { price, trend }
  }

}
