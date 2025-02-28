import {NgForOf, NgIf} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core'
import {MatButton} from '@angular/material/button'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardLgImage,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup
} from '@angular/material/card'
import {MatGridList, MatGridTile} from '@angular/material/grid-list'
import {MatIcon} from '@angular/material/icon'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import {ActivatedRoute, Router} from '@angular/router'
import {TranslateModule} from '@ngx-translate/core'
import {combineLatestWith} from 'rxjs'

import {AuthService} from '../../../auth/service/auth.service'
import {CartSessionItem} from '../../../cart/model/cart-session-item.model'
import {CartSessionService} from '../../../cart/service/cart-session.service'
import {FilterComponent} from '../../../shared/filter/component/filter.component'
import {ColumnDefModel} from '../../../shared/filter/model/column-def.model'
import {EnumColumnTypeModel} from '../../../shared/filter/model/enum-column-type.model'
import {FilterCriteriaModel} from '../../../shared/filter/model/filter-criteria.model'
import {PageResponseModel} from '../../../shared/filter/model/page-response.model'
import {FilterOperatorEnum} from '../../../shared/filter/valueobject/filter-operator.enum'
import {BookService} from '../../service/book.service'
import {BookFilterModel} from '../model/book-filter.model'
import {BookTableModel} from '../model/book-table.model'

const CONFIG_NAME = 'book-list'

/**
 * Component for the book list.
 */
@Component({
  selector: 'app-book-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterComponent,
    MatGridList,
    NgForOf,
    MatCardHeader,
    MatCardTitleGroup,
    MatCardTitle,
    MatCardSubtitle,
    TranslateModule,
    MatCardLgImage,
    MatCardContent,
    MatCardActions,
    MatIcon,
    MatPaginator,
    MatGridTile,
    MatCard,
    NgIf,
    MatButton
  ],
  providers: [],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  // Injected services instead of using the constructor.
  private router: Router = inject(Router)
  private bookService: BookService = inject(BookService)
  private route: ActivatedRoute = inject(ActivatedRoute)
  private cartSessionService = inject(CartSessionService)
  private authService = inject(AuthService)

  @ViewChild('box', {static: false}) private box!: ElementRef
  private favorite = false

  protected maxColumns = 4
  protected cartSessionItems: CartSessionItem[] = []
  protected columns: WritableSignal<ColumnDefModel[]> = signal([])
  protected bookFilter: BookFilterModel = BookFilterModel.createDefaultFilter(CONFIG_NAME)
  protected books: WritableSignal<PageResponseModel<BookTableModel> | null> = signal(null)

  /**
   * Initializes the component by fetching authors and categories options and setting up the column definitions.
   */
  ngOnInit(): void {
    this.getNewCartSessionItems()
    this.favorite = this.route.snapshot.data['favorite']

    this.bookService.getBookAuthorsOptionViews().pipe(
      combineLatestWith(this.bookService.getBookCategoriesOptionViews())
    ).subscribe(([authors, categories]) => {
      this.columns.set([
        new ColumnDefModel('SEARCH_ISBN13', 'isbn13', 'string',
          new FilterCriteriaModel(FilterOperatorEnum.ILIKE, this.bookFilter.isbn13?.value)),
        new ColumnDefModel('SEARCH_ISBN10', 'isbn10', 'string',
          new FilterCriteriaModel(FilterOperatorEnum.ILIKE, this.bookFilter.isbn10?.value)),
        new ColumnDefModel('SEARCH_TITLE', 'title', 'string',
          new FilterCriteriaModel(FilterOperatorEnum.ILIKE, this.bookFilter.title?.value)),
        new ColumnDefModel('SEARCH_AUTHORS', 'authors', EnumColumnTypeModel.fromOptionViews(authors),
          new FilterCriteriaModel(FilterOperatorEnum.IN, this.bookFilter.authors?.value)),
        new ColumnDefModel('SEARCH_CATEGORY', 'categories',
          EnumColumnTypeModel.fromOptionViews(categories),
          new FilterCriteriaModel(FilterOperatorEnum.IN, this.bookFilter.categories?.value))
      ])
    })

    this.filterBooks()
  }

  /**
   * Updates the book filter with the selected column definition and filters the books.
   *
   * @param columnDef
   * @see ColumnDefModel
   */
  filterBooksWithColumnDef(columnDef: ColumnDefModel[]) {
    this.bookFilter = ColumnDefModel.prepareColumns(columnDef, this.bookFilter)
    this.filterBooks()
  }

  /**
   * Changes the page size and index of the book filter and filters the books.
   *
   * @param event is the page event emitted by the paginator.
   */
  onChangePage(event: PageEvent) {
    this.bookFilter.size = event.pageSize
    this.bookFilter.page = event.pageIndex
    this.filterBooks()
  }

  /**
   * Navigates to the book detail page for the given book ID.
   *
   * @param bookId - The ID of the book to view details for.
   */
  goToBookDetail(bookId: number) {
    this.router.navigate([`/book-list/${bookId}`])
  }

  /**
   * Adds a book to the cart.
   *
   * @param event - The click event.
   * @param bookId - The ID of the book to add to the cart.
   */
  onAddBookToCart(event: MouseEvent, bookId: number) {
    event.stopPropagation()
    this.cartSessionService.createOrUpdateBookInCart(bookId, 1)
    this.getNewCartSessionItems()
  }

  /**
   * Removes a book from the cart.
   *
   * @param event - The click event.
   * @param bookId - The ID of the book to remove from the cart.
   */
  onRemoveBookFromCart(event: MouseEvent, bookId: number) {
    event.stopPropagation()
    this.cartSessionService.removeBookFromCart(bookId)
    this.getNewCartSessionItems()
  }

  /**
   * On box resize, calculate the number of columns to display.
   *
   * @see maxColumns
   */
  onBoxResize() {
    if (this.box) {
      const n = Math.floor(this.box.nativeElement.clientWidth / 400)
      this.maxColumns = n > 0 ? n : 1
    } else {
      this.maxColumns = 1
    }
  }

  /**
   * Checks if the user is signed in.
   */
  isUserSignedIn(): boolean {
    return this.authService.isSignedIn()
  }

  getSessionCartQuantityByBookId(bookId: number): number {
    return this.cartSessionItems.find(item => item.bookId === bookId)?.quantity ?? 0
  }

  /**
   * Gets the quantity of a book in the cart.
   * If the book is not in the cart, the quantity is 0.
   *
   * @private
   */
  private getNewCartSessionItems() {
    this.cartSessionItems = this.cartSessionService.getCart()
  }

  /**
   * Calls the book service to filter the books with the current book filter.
   *
   * @see BookService
   */
  private filterBooks(): void {
    sessionStorage.setItem(CONFIG_NAME, JSON.stringify(this.bookFilter))
    this.bookService.filterBooks(this.bookFilter, this.favorite).subscribe((response) => {
      this.books.set(response)
      this.onBoxResize()
    })
  }
}

