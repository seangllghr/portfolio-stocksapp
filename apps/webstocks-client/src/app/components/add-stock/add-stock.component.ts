import { Component } from '@angular/core';
import { MenuAction, UiService } from '../../services/ui-service.service';

@Component({
  selector: 'webstocks-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent {
  constructor(private uiService: UiService) {

  }

  onSearchClick(): void {
    console.log('Searching');
  }

  onCancelClick(): void {
    this.uiService.setMenuAction(MenuAction.BACK);
  }
}
