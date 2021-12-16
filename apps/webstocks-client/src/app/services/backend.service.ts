import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResults, StockData } from '@portfolio-stocksapp/shared-data-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  /**
   * Call the backend and add the stock with the provided symbol to the database
   *
   * @param {string} symbol - the ticker symbol of the stock to add
   * @returns {Object} - an object containing:
   * - success - true if the stock was added successfully
   * - message - the message set by the server detailing the result
   */
  addStock(symbol: string): Observable<{ success: boolean, message: string }> {
    return this.http.post<{ success: boolean, message: string }>(
      `${this.apiUrl}/market-sync/add`,
      {},
      { params: new HttpParams().set('symbol', symbol) }
    )
  }

  /**
   * Call the backend to remove a stock from the database
   *
   * @param {string} symbol - the stock ticker symbol to delete
   * @returns {Observable} an observable, yielding the count of deleted objects
   */
  deleteStock(symbol: string): Observable<{ deletedCount: number }> {
    const url = `${this.apiUrl}/stock/${symbol}`;
    return this.http.delete<{ deletedCount: number }>(url);
  }

  /**
   * Get the single stock from the database matching the string
   *
   * @param {string} symbol - the stock to search
   * @returns {Observable<Stock>} Observable, updates with the stock
   */
  getStock(symbol: string): Observable<StockData> {
    return this.http.get<StockData>(`${this.apiUrl}/stock/${symbol}`);
  }

  /**
   * Get the full stock list from the backend
   *
   * @returns {Observable<StockData>[]} Observable, updates with the stock list
   */
  getStocks(): Observable<StockData[]> {
    return this.http.get<StockData[]>(`${this.apiUrl}/stock/`);
  }

  /**
   * Call the backend to make a search against the upstream search API
   *
   * @param {string} keyword - the keyword or string to search for
   * @returns {Observable<SearchResults>} Observable, yields the search results
   */
  getSearchResults(keyword: string): Observable<SearchResults> {
    const url = `${this.apiUrl}/market-sync/search`
    const params = new HttpParams().set('keyword', keyword)
    return this.http.get<SearchResults>(url, { params: params })
  }
}
