import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockInterface as Stock } from '@portfolio-stocksapp/shared-data-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:3333/api/stock/';

  constructor(private http: HttpClient) {}

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }
}
