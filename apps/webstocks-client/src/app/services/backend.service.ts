import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResults, Stock } from '@portfolio-stocksapp/shared-data-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  addStock(symbol: string): Observable<{ success: boolean, message: string }> {
    return this.http.post<{ success: boolean, message: string }>(
      `${this.apiUrl}/market-sync/add`,
      {},
      { params: new HttpParams().set('symbol', symbol) }
    )
  }

  deleteStock(symbol: string): Observable<{ deletedCount: number }> {
    const url = `${this.apiUrl}/stock/${symbol}`;
    return this.http.delete<{ deletedCount: number }>(url);
  }

  getStock(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/stock/${symbol}`);
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/`);
  }

  getSearchResults(keyword: string): Observable<SearchResults> {
    const url = `${this.apiUrl}/market-sync/search`
    const params = new HttpParams().set('keyword', keyword)
    return this.http.get<SearchResults>(url, { params: params })
  }
}
