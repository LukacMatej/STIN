import {inject, Injectable} from '@angular/core'
import {Nullable} from 'primeng/ts-helpers'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'
import {BookRatingModel} from '../detail/model/book-rating.model'
import {BookRatingCreateModel} from '../detail/model/book-rating-create.model'

/**
 * Service to handle book rating operations such as creating, updating, and deleting ratings.
 */
@Injectable({providedIn: 'root'})
export class BookRatingService {
  private httpService: HttpService = inject(HttpService)

  /**
   * Fetches the rating for the book.
   *
   * @param bookId
   */
  getRating(bookId: number): Observable<Nullable<BookRatingModel>> {
    return this.httpService.get(`${BASE_API_URL}book/${bookId}/rating`)
  }

  /**
   * Retrieves the comments for a book based on the provided book ID.
   *
   * @param bookId
   * @param rating
   */
  createRating(bookId: number, rating: BookRatingCreateModel): Observable<boolean> {
    return this.httpService.post(`${BASE_API_URL}book/${bookId}/rating`, rating)
  }


  /**
   * Updates the rating for the book.
   *
   * @param bookId
   * @param bookRatingCreateModel
   */
  updateRating(bookId: number, bookRatingCreateModel: BookRatingCreateModel): Observable<boolean> {
    return this.httpService.put(`${BASE_API_URL}book/${bookId}/rating`, bookRatingCreateModel)
  }

  /**
   * Deletes the rating for the book.
   *
   * @param bookId
   */
  deleteRating(bookId: number) {
    return this.httpService.delete(`${BASE_API_URL}book/${bookId}/rating`)
  }
}
