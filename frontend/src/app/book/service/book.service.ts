import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {OptionViewModel} from '../../shared/filter/model/option-view.model'
import {PageResponseModel} from '../../shared/filter/model/page-response.model'
import {HttpService} from '../../shared/http/service/http.service'
import {BookCommentCreateModel} from '../detail/model/book-comment-create.model'
import {BookDetailModel} from '../detail/model/book-detail.model'
import {BookFilterModel} from '../list/model/book-filter.model'
import {BookTableModel} from '../list/model/book-table.model'

/**
 * Service to handle book operations such as filtering books, retrieving book categories, and authors.
 * Marks the service as injectable and provided at the root level, making it a singleton service accessible throughout the entire application.
 */
@Injectable({providedIn: 'root'})
export class BookService {
  private httpService: HttpService = inject(HttpService)

  /**
   * Filters books based on the provided book filter.
   *
   * @param bookFilterModel The book filter model containing the filter criteria.
   * @param favorite Whether to filter favorite books.
   * @returns An observable of PageResponseModel<BookTableModel> containing the filtered books.
   * @see BookFilterModel
   * @see PageResponseModel
   * @see BookTableModel
   */
  filterBooks(bookFilterModel: BookFilterModel, favorite: boolean): Observable<PageResponseModel<BookTableModel>> {
    return this.httpService.post(`${BASE_API_URL}book/filter?favorite=${favorite}`, bookFilterModel)
  }

  /**
   * Retrieves the available book categories as option views.
   *
   * @returns An observable of OptionViewModel[] containing the book categories as option views.
   * @see OptionViewModel
   */
  getBookCategoriesOptionViews(): Observable<OptionViewModel[]> {
    return this.httpService.get(`${BASE_API_URL}book/categories`)
  }

  /**
   * Retrieves the available book authors as option views.
   *
   * @returns An observable of OptionViewModel[] containing the book authors as option views.
   * @see OptionViewModel
   */
  getBookAuthorsOptionViews(): Observable<OptionViewModel[]> {
    return this.httpService.get(`${BASE_API_URL}book/authors`)
  }

  /**
   * Retrieves the details of a book based on the provided book ID.
   *
   * @param id The ID of the book to retrieve.
   * @returns An observable of BookTableModel containing the details of the book.
   * @see BookDetailModel
   */
  getBookDetail(id: number): Observable<BookDetailModel> {
    return this.httpService.get(`${BASE_API_URL}book/${id}`)
  }

  /**
   * Posts a comment for a book based on the provided book ID and comment.
   *
   * @param bookId The ID of the book to post the comment for.
   * @param comment The comment to post for the book.
   */
  createComment(bookId: number, comment: BookCommentCreateModel): Observable<boolean> {
    return this.httpService.post(`${BASE_API_URL}book/${bookId}/comment`, comment)
  }
}
