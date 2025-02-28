import {CdkTextareaAutosize} from '@angular/cdk/text-field'
import {NgClass, NgForOf, NgIf} from '@angular/common'
import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButton, MatIconButton} from '@angular/material/button'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
  MatCardXlImage
} from '@angular/material/card'
import {MatFormField} from '@angular/material/form-field'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {ActivatedRoute} from '@angular/router'
import {TranslateModule, TranslateService} from '@ngx-translate/core'
import moment from 'moment'
import {Nullable} from 'primeng/ts-helpers'

import {AuthService} from '../../../auth/service/auth.service'
import {CartSessionService} from '../../../cart/service/cart-session.service'
import {NotificationService} from '../../../shared/notification/notification.service'
import {OrderByPipe} from '../../../shared/pipe/order-by.pipe'
import {BookService} from '../../service/book.service'
import {BookFavoriteService} from '../../service/book-favorite.service'
import {BookRatingService} from '../../service/book-rating.service'
import {BookCommentCreateModel} from '../model/book-comment-create.model'
import {BookDetailModel} from '../model/book-detail.model'
import {BookRatingCreateModel} from '../model/book-rating-create.model'

/**
 * Component for the book detail.
 */
@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    NgIf,
    MatCardTitle,
    MatIcon,
    MatIconButton,
    MatCardSubtitle,
    NgForOf,
    TranslateModule,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatFormField,
    FormsModule,
    MatInput,
    CdkTextareaAutosize,
    MatCard,
    OrderByPipe,
    MatCardTitleGroup,
    MatCardHeader,
    NgClass,
    MatCardXlImage
  ],
  providers: [],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  // Injects bookService instead of using constructor injection.
  private route = inject(ActivatedRoute)
  private authService = inject(AuthService)
  private bookService = inject(BookService)
  private translateService = inject(TranslateService)
  private bookRatingService = inject(BookRatingService)
  private notificationService = inject(NotificationService)
  private bookFavoriteService = inject(BookFavoriteService)
  private cartSessionService = inject(CartSessionService)

  protected book: WritableSignal<Nullable<BookDetailModel>> = signal(null)
  protected commentInput: WritableSignal<string> = signal('')
  protected ratingInput: WritableSignal<number> = signal(0)
  protected isBookFavorite: WritableSignal<boolean> = signal(false)
  protected bookQuantity = 1

  protected readonly moment = moment
  private bookId: Nullable<number> = null
  private ratingExists = false

  /**
   * Initializes the component. Fetches the book detail based on the book id.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = params['id']
      if (bookId) {
        this.bookId = Number(bookId)
        this.getBookDetail()
        this.bookQuantity = this.cartSessionService.getItemFromCart(this.bookId)?.quantity ?? 0

        if (this.isUserSignedIn()) {
          this.getUserBookRating()
        }
      }
    })
  }

  /**
   * Shows the icon based on the rating.
   * @param index
   */
  showBookIcons(index: number) {
    if (this.ratingInput() >= index + 1) {
      return 'star'
    } else {
      return 'star_border'
    }
  }

  /**
   * Submits a comment for the book.
   */
  onSubmitComment() {
    if (this.book()?.disabled) {
      this.translateService.get('DISABLED_BOOK').subscribe((res: string) => {
        this.notificationService.errorNotification(res)
      })
      return
    }

    this.bookService.createComment(this.bookId!, new BookCommentCreateModel(this.commentInput())).subscribe({
      next: () => {
        this.translateService.get('COMMENT_POSTED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
        this.getBookDetail()
      },
      error: () => {
        this.translateService.get('POST_COMMENT_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Deletes the rating for the book.
   */
  onDeleteBookRating() {
    this.bookRatingService.deleteRating(this.bookId!).subscribe({
      next: () => {
        this.translateService.get('RATING_DELETED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
        this.ratingInput.set(0)
        this.ratingExists = false
        this.getBookDetail()
      },
      error: () => {
        this.translateService.get('RATING_DELETED_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Submits the rating for the book.
   *
   * If the rating exists, it will update the existing rating.
   * If the rating does not exist, it will create a new rating.
   */
  onAddBookRating(): void {
    if (!this.ratingExists) {
      this.createNewBookRating()
    } else {
      this.updateExistingBookRating()
    }
  }

  /**
   * Toggles the favorite status of the book.
   *
   * If the book is already marked as favorite, it will be removed from favorites.
   * If the book is not marked as favorite, it will be added to favorites.
   */
  onSubmitBookFavorite(): void {
    if (this.isBookFavorite()) {
      this.deleteBookFromFavorite()
    } else {
      this.addBookToFavorite()
    }
  }

  /**
   * Checks if the user is signed in.
   */
  isUserSignedIn(): boolean {
    return this.authService.isSignedIn()
  }

  /**
   * Adds a book to the cart.
   *
   * @param event - The click event.
   */
  onAddBookToCart(event: MouseEvent) {
    event.stopPropagation()
    this.cartSessionService.createOrUpdateBookInCart(this.bookId!, 1)
    this.bookQuantity = this.cartSessionService.getItemFromCart(this.bookId!)?.quantity ?? 0
  }

  /**
   * Removes a book from the cart.
   *
   * @param event - The click event.
   */
  onRemoveBookFromCart(event: MouseEvent) {
    event.stopPropagation()
    this.cartSessionService.removeBookFromCart(this.bookId!)
    this.bookQuantity = this.cartSessionService.getItemFromCart(this.bookId!)?.quantity ?? 0
  }

  /**
   * Fetches the book detail based on the book id.
   *
   * @see BookService.getBookDetail
   * @see BookDetailModel
   * @private
   */
  private getBookDetail(): void {
    this.bookService.getBookDetail(this.bookId!).subscribe({
      next: (response) => {
        this.book.set(response)
        this.isBookFavorite.set(response.favorite)
      },
      error: () => {
        this.translateService.get('auth.Error').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Fetches the rating for the book.
   * Sets the rating input and updates the rating existence flag.
   *
   * @private
   */
  private getUserBookRating(): void {
    this.bookRatingService.getRating(this.bookId!).subscribe((response) => {
      this.ratingInput.set(response?.rating ?? 0)
      this.ratingExists = response?.rating !== null
    })
  }

  /**
   * Creates a new rating for the book.
   *
   * @see BookService.createRating
   * @private
   */
  private createNewBookRating() {
    this.bookRatingService.createRating(this.bookId!, new BookRatingCreateModel(this.ratingInput())).subscribe({
      next: () => {
        this.translateService.get('RATING_POSTED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
        this.ratingExists = true
        this.getBookDetail()
      },
      error: () => {
        this.translateService.get('RATING_POSTED_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Updates an existing rating for the book.
   *
   * @see BookService.updateRating
   * @private
   */
  private updateExistingBookRating() {
    this.bookRatingService.updateRating(this.bookId!, new BookRatingCreateModel(this.ratingInput())).subscribe({
      next: () => {
        this.translateService.get('RATING_POSTED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
        this.getBookDetail()
      },
      error: () => {
        this.translateService.get('RATING_POSTED_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Marks a book as favorite.
   */
  private addBookToFavorite(): void {
    this.bookFavoriteService.addFavorite(this.bookId!).subscribe({
      next: () => {
        this.translateService.get('favorite.addSuccess').subscribe((res: string) => {
          this.notificationService.successNotification(res)
          this.isBookFavorite.set(true)
        })
      },
      error: () => {
        this.translateService.get('favorite.addError').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Removes a book from favorites.
   */
  private deleteBookFromFavorite(): void {
    this.bookFavoriteService.removeFavorite(this.bookId!).subscribe({
      next: () => {
        this.translateService.get('favorite.removeSuccess').subscribe((res: string) => {
          this.notificationService.successNotification(res)
          this.isBookFavorite.set(false)
        })
      },
      error: () => {
        this.translateService.get('favorite.removeError').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }
}
