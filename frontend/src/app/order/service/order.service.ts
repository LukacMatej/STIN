import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {PageResponseModel} from '../../shared/filter/model/page-response.model'
import {HttpService} from '../../shared/http/service/http.service'
import {CartFilterModel} from '../model/cart-filter.model'
import {CartTableModel} from '../model/cart-table.model'

@Injectable({providedIn: 'root'})
export class OrderService {
  private httpService: HttpService = inject(HttpService)

  /**
   * Filters orders based on the provided order filter model.
   *
   * @param filterModel The order filter model containing the filter criteria.
   * @returns An observable of PageResponseModel<CartTableModel> containing the filtered orders.
   * @see CartFilterModel
   * @see PageResponseModel
   * @see CartTableModel
   */
  filterOrders(filterModel: CartFilterModel): Observable<PageResponseModel<CartTableModel>> {
    return this.httpService.post(`${BASE_API_URL}cart/filter`, filterModel)
  }
}
