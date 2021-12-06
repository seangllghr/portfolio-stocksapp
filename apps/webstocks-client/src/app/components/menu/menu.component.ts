import { Component } from '@angular/core';
import { UiService } from '../../services/ui-service.service';

@Component({
  selector: 'webstocks-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  title: string;
  showDelete = false;

  constructor(private uiService: UiService) {
    this.title = this.uiService.appMainTitle;
    this.uiService.onSelectStock()
      .subscribe((state) => this.showDelete = state.showStockDetail)
  }

}
