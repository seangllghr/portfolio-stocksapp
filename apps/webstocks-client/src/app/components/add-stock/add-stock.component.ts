import { Component } from '@angular/core';
import { Match, SearchResults } from '@portfolio-stocksapp/shared-data-model';
import { BackendService } from '../../services/backend.service';
import { MenuAction, UiService } from '../../services/ui.service';

@Component({
  selector: 'webstocks-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent {
  keyword = '';
  searchResults: SearchResults = { success: false, reason: '' }
  constructor(
    private backend: BackendService,
    private uiService: UiService,
  ) {}

  onKeywordChange(keyword: string) {
    this.keyword = keyword;
  }

  onSearchClick(): void {
    if (!this.keyword) {
      this.searchResults = {
        success: false,
        reason: 'Please provide a keyword!'
      }
      return;
    }
    console.log(`Searching for ${this.keyword}`);
    this.backend.getSearchResults(this.keyword).subscribe(results => {
      this.searchResults = results;
      console.log(results);
    });
  }

  onCancelClick(): void {
    this.uiService.setMenuAction(MenuAction.BACK);
  }

  onAddStock(match: Match): void {
    console.log(`Add stock ${match.symbol} to database`);
  }
}
