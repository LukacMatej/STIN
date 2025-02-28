import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'
import {CartCreateModel} from '../model/cart-create.model'

/**
 * Service for the cart API.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private httpService: HttpService = inject(HttpService)

  /**
   * Create a cart with the given cart create model.
   *
   * @param cartCreate The cart create model.
   * @returns An observable with a boolean value.
   */
  createCart(cartCreate: CartCreateModel): Observable<boolean> {
    return this.httpService.post(`${BASE_API_URL}cart`, cartCreate)
  }
}
