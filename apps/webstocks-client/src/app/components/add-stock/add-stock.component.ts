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

  /**
   * Set an error message for a failed search query
   *
   * @param {string} message - the error message to set
   */
  set searchErrorMessage(message: string) {
    this._errorMessage = `Search failed: ${message}`;
  }

  /**
   * Set an error message when the backend fails to add a stock
   *
   * @param {string} message - the error message to set
   */
  set addErrorMessage(message: string) {
    this._errorMessage = `Failed to add stock: ${message}`;
  }

  clearErrorMessage(): void {
    this._errorMessage = '';
  }

  onKeywordChange(keyword: string) {
    this.keyword = keyword;
  }

  /**
   * Calls the backend service's search method with the given keyword and
   * waits for results
   */
  onSearchClick(): void {
    if (!this.keyword) { // Complain if the keyword is blank
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

  /**
   * Remove a result from the display. Won't remove it from future searches
   *
   * @param {string} symbol - the symbol of the stock to remove from the list
   */
  removeResult(symbol: string): Match[] {
    const newResults: Match[] = [];
    this.searchResults.matches?.forEach(match => {
      if (match.symbol !== symbol) newResults.push(match);
    });
    return newResults;
  }

  /**
   * @param {Match} match - the Match object containing the stock's symbol
   */
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
