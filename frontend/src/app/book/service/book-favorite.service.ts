import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'

/**
 * Service to handle book favorite operations such as adding and removing books from favorites.
 */
@Injectable({providedIn: 'root'})
export class BookFavoriteService {
  private httpService: HttpService = inject(HttpService)

  /**
   * Adds a book to the user's favorites.
   *
   * @param bookId The ID of the book to add to favorites.
   * @returns An observable of void.
   */
  addFavorite(bookId: number): Observable<boolean> {
    return this.httpService.post(`${BASE_API_URL}book/${bookId}/favorite`, {})
  }

  /**
   * Removes a book from the user's favorites.
   *
   * @param bookId The ID of the book to remove from favorites.
   * @returns An observable of void.
   */
  removeFavorite(bookId: number): Observable<boolean> {
    return this.httpService.delete(`${BASE_API_URL}book/${bookId}/favorite`)
  }
}
