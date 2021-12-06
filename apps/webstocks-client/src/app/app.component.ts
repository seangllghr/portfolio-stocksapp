import { Component } from '@angular/core';
import { UiService } from './services/ui-service.service';

@Component({
  selector: 'webstocks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title: string;
  showStockChart = false;

  constructor(private uiService: UiService) {
    this.title = this.uiService.appMainTitle;
    this.uiService.onSelectStock()
      .subscribe(state => this.showStockChart = state.showStockDetail);
  }
}
