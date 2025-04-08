import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'
import {StockModel} from '../model/stock.model'
import {StockFilterModel} from '../model/stock.filter.model'

@Injectable({providedIn: 'root'})
export class PortfolioService {
  private httpService: HttpService = inject(HttpService)
  getStocks(): Observable<StockModel[]> {
    return this.httpService.get(`${BASE_API_URL}stocks`)
  }

  filterStocks(bookFilter: StockFilterModel): Observable<StockModel[]> {
    return this.httpService.post(`${BASE_API_URL}stocks/filter`, bookFilter)
  }
}
