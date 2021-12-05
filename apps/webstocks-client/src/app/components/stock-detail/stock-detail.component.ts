import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { StockDetailState, UiService } from '../../services/ui-service.service';

@Component({
  selector: 'webstocks-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stockDetailState: StockDetailState = {
    showStockDetail: false,
    selectedStock: new Stock()
  };

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
      this.stockDetailState = state
    })
  }

  closeStockDetail() {
    this.router.navigate(['/']);
  }

}
