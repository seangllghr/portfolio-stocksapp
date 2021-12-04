import { Component } from '@angular/core';
import { StockDetailState, UiService } from '../../../services/ui-service.service';
import { Stock } from '@portfolio-stocksapp/shared-data-model';

@Component({
  selector: 'webstocks-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent {
  stockDetailState: StockDetailState = {
    selectedStock: new Stock(),
    showStockDetail: false
  };

  constructor(private uiService: UiService) {
    this.uiService.onSelectStock()
      .subscribe((state: StockDetailState) => this.stockDetailState = state)
  }

}
