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
  private _errorMessage = '';

  constructor(
    private backend: BackendService,
    private ui: UiService,
  ) {}

  get errorMessage(): string {
    return this._errorMessage;
  }

  set searchErrorMessage(message: string) {
    this._errorMessage = `Search failed: ${message}`;
  }

  set addErrorMessage(message: string) {
    this._errorMessage = `Failed to add stock: ${message}`;
  }

  clearErrorMessage(): void {
    this._errorMessage = '';
  }

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
    if (this.addErrorMessage) this.addErrorMessage = '';
    this.backend.getSearchResults(this.keyword).subscribe(results => {
      this.searchResults = results;
      if (!results.success && results.reason)
        this.searchErrorMessage = results.reason;
    });
  }

  onCancelClick(): void {
    this.ui.setMenuAction(MenuAction.BACK);
  }

  removeResult(symbol: string): Match[] {
    const newResults: Match[] = [];
    this.searchResults.matches?.forEach(match => {
      if (match.symbol !== symbol) newResults.push(match);
    });
    return newResults;
  }

  onAddStock(match: Match): void {
    this.clearErrorMessage();
    this.backend.addStock(match.symbol).subscribe(result => {
      if (result.success) {
        this.ui.setMenuAction(MenuAction.REFRESH);
        this.searchResults.matches = this.removeResult(match.symbol);
      } else if (result.message === 'Stock already exists') {
        this.searchResults.matches = this.removeResult(match.symbol);
        this.addErrorMessage = result.message;
      } else {
        this.addErrorMessage = result.message;
      }
    })
  }
}
