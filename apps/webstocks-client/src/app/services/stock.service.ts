import { Injectable } from '@angular/core';
import { StockInterface as Stock } from '@portfolio-stocksapp/shared-data-model';
import { Observable, of } from 'rxjs';
import { STOCKS } from '../../stocks-list';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  getStocks(): Observable<Stock[]> {
    const stocks: Observable<Stock[]> = of(STOCKS);
    return stocks;
  }
}
