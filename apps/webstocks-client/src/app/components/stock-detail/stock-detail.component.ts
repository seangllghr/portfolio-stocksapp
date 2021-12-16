import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'webstocks-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
})
export class StockDetailComponent implements OnInit {
  showStockDetail = false;
  stock = new Stock();
  collapse = false;

  constructor(private route: ActivatedRoute, private ui: UiService) {
    this.route.paramMap.subscribe((params) => {
      this.ui.setStockSelection(params.get('Symbol') || '');
    });
  }

  ngOnInit(): void {
    this.ui.onSelectStock().subscribe((state) => {
      this.showStockDetail = state.showStockDetail;
      this.stock = state.selectedStock;
    });
  }

  closeStockDetail() {
    this.ui.unsetStockSelection();
  }

  toggleCollapseDetail() {
    this.collapse = !this.collapse;
  }
}
