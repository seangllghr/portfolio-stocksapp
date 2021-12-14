import { Component } from '@angular/core';
import { UiService, MenuAction } from '../../services/ui.service';

@Component({
  selector: 'webstocks-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  title: string;
  showDelete = false;

  constructor(private ui: UiService) {
    this.title = this.ui.appMainTitle;
    this.ui
      .onSelectStock()
      .subscribe((state) => (this.showDelete = state.showStockDetail));
  }

  addButtonClick(): void {
    this.ui.setMenuAction(MenuAction.ADD);
  }

  deleteButtonClick(): void {
    this.ui.setMenuAction(MenuAction.DELETE);
  }

  refreshButtonClick(): void {
    this.ui.setMenuAction(MenuAction.REFRESH);
  }
}
