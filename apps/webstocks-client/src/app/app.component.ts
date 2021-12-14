import { Component } from '@angular/core';
import { UiService } from './services/ui.service';

@Component({
  selector: 'webstocks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title: string;
  showStockChart = false;

  constructor(private ui: UiService) {
    this.title = this.ui.appMainTitle;
    this.ui
      .onSelectStock()
      .subscribe((state) => (this.showStockChart = state.showStockDetail));
  }
}
