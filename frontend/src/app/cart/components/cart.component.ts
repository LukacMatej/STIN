import {NgIf} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core'
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {MatOption} from '@angular/material/autocomplete'
import {MatButton} from '@angular/material/button'
import {MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card'
import {MatFormField, MatLabel} from '@angular/material/form-field'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {MatSelect} from '@angular/material/select'
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper'
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table'
import {Router} from '@angular/router'
import {TranslateModule, TranslateService} from '@ngx-translate/core'
import {PaginatorModule} from 'primeng/paginator'
import {Nullable} from 'primeng/ts-helpers'

import {BookFilterModel} from '../../book/list/model/book-filter.model'
import {BookTableModel} from '../../book/list/model/book-table.model'
import {BookService} from '../../book/service/book.service'
import {PersonInfoComponent} from '../../person-info/components/person-info.component'
import {PersonInfoFormValue} from '../../person-info/model/person-info.form'
import {PersonInfoAddressModel} from '../../person-info/model/person-info-address.model'
import {PersonInfoService} from '../../person-info/service/person-info.service'
import {FilterCriteriaModel} from '../../shared/filter/model/filter-criteria.model'
import {PageResponseModel} from '../../shared/filter/model/page-response.model'
import {FilterOperatorEnum} from '../../shared/filter/valueobject/filter-operator.enum'
import {NotificationService} from '../../shared/notification/notification.service'
import {isNullOrUndefined} from '../../shared/util/shared-util'
import {CartForm, CartFormGroup} from '../model/cart.form'
import {CartCreateModel} from '../model/cart-create.model'
import {CartItemCreateModel} from '../model/cart-item-create.model'
import {CartSessionItem, CartSessionItemView} from '../model/cart-session-item.model'
import {CartService} from '../service/cart.service'
import {CartSessionService} from '../service/cart-session.service'
import {addPaymentMethodToPrice, PaymentMethodEnum} from '../valueobject/payment-method.enum'

const CONFIG_NAME = 'cart-main-stepper'

/**
 * Component used as root for the cart stepper.
 */
@Component({
  selector: 'app-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    PersonInfoComponent,
    TranslateModule,
    MatButton,
    MatStepperPrevious,
    MatStepperNext,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatRow,
    MatRowDef,
    MatTable,
    PaginatorModule,
    MatHeaderCellDef,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardTitle,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatCardSubtitle
  ],
  providers: [PersonInfoComponent, FormBuilder],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private router = inject(Router)
  private cartService = inject(CartService)
  private formBuilder = inject(FormBuilder)
  private bookService = inject(BookService)
  private translateService = inject(TranslateService)
  private personInfoService = inject(PersonInfoService)
  private cartSessionService = inject(CartSessionService)
  private notificationService = inject(NotificationService)

  protected booksPrice = 0
  protected booksTotalPrice = 0
  protected formGroup: FormGroup<CartFormGroup> = this.buildFormGroup()

  protected cartSessionItems: WritableSignal<CartSessionItem[]> = signal([])
  protected bookFilter: BookFilterModel = BookFilterModel.createDefaultFilter(CONFIG_NAME)
  protected books: WritableSignal<PageResponseModel<BookTableModel> | null> = signal(null)
  protected personInfoAddress: Nullable<PersonInfoAddressModel> = null

  protected readonly confirmationStepDisplayedColumns = ['title', 'price', 'quantity', 'totalPrice']
  protected readonly introStepDisplayedColumns = ['title', 'price', 'quantity', 'totalPrice', 'remove']
  protected readonly paymentMethodEnum = PaymentMethodEnum

  /**
   * Cart session item views, when cart session items are updated, this will be updated too.
   * @protected
   */
  protected cartSessionItemViews = computed(() => {
    return this.cartSessionItems().map(item => {
      const book = this.books()?.content.find(model => model?.id === item.bookId)
      return {
        ...item,
        title: book?.title,
        price: book?.price
      } as CartSessionItemView
    })
  })

  private calculatePricesEffect = effect(() => {
    this.cartSessionItemViews()
    this.calculateTotalPrice()
  })

  public ngOnInit(): void {
    this.cartSessionItems.set(this.cartSessionService.getCart())
    this.filterBooks()
    this.getPersonInfo()
  }

  /**
   * Updates the cart when user leaves the page.
   */
  public ngOnDestroy(): void {
    this.cartSessionItemViews().map((item) => {
      this.cartSessionService.createOrUpdateBookInCart(item.bookId, item.quantity, true)
    })
  }

  /**
   * Filter book by book ids from cart.
   *
   * @private
   */
  private filterBooks() {
    const size = this.cartSessionItems().length
    const ids = this.cartSessionItems().map(item => item.bookId)

    this.bookFilter.size = size
    this.bookFilter.id = new FilterCriteriaModel(FilterOperatorEnum.IN, ids)
    if (size === 0) {
      this.books.set(null)
      return
    }

    this.bookService.filterBooks(this.bookFilter, false).subscribe((response) => {
      this.books.set(response)
    })
  }

  protected getPersonInfo(stepper: Nullable<MatStepper> = null) {
    this.personInfoService.getUserInfo().subscribe({
      next: (response) => {
        this.personInfoAddress = PersonInfoFormValue(response).billingAddress
        stepper?.next()
      }
    })
  }

  /**
   * Remove book from cart.
   *
   * @param bookId
   * @protected
   */
  protected onRemoveBookFromCart(bookId: number) {
    this.cartSessionService.removeBookFromCart(bookId)
    this.cartSessionItems.set(this.cartSessionService.getCart())

    if (this.books !== null) {
      this.books()!.content = this.books()!.content.filter(book => book.id !== bookId)
    }
  }


  /**
   * Recalculate book's prices and total price with the selected payment method.
   * @protected
   */
  protected calculateTotalPrice() {
    this.booksPrice = this.cartSessionItemViews().reduce((acc, item) => {
      const itemTotal = (item.price ?? 0) * item.quantity
      return acc + itemTotal
    }, 0)

    if (isNullOrUndefined(this.formGroup.value.paymentMethod)) {
      this.booksTotalPrice = this.booksPrice
    } else {
      this.booksTotalPrice = addPaymentMethodToPrice(this.booksPrice, this.formGroup.value.paymentMethod!)
    }
  }

  /**
   * Navigate to the book detail page.
   *
   * @param id
   * @protected
   */
  protected goToBookDetail(id: number) {
    this.router.navigate([`/book-list/${id}`])
  }

  /**
   * Check if the form is valid and calls the service to create the cart.
   * @protected
   */
  protected onSubmit() {
    if (this.formGroup.invalid) {
      this.translateService.get('INVALID_DATA').subscribe((res: string) => {
        this.notificationService.errorNotification(res)
      })
      return
    }

    if (this.cartSessionItemViews().length === 0) {
      this.translateService.get('CART_CANNOT_BE_EMPTY').subscribe((res: string) => {
        this.notificationService.errorNotification(res)
      })
      return
    }

    const cartCreateModel = new CartCreateModel(
      this.formGroup.value.paymentMethod!,
      CartItemCreateModel(this.cartSessionItemViews())
    )

    this.cartService.createCart(cartCreateModel).subscribe({
      next: () => {
        this.translateService.get('PAYMENT_SUCCESS').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
        this.cartSessionService.clearCart()
        this.router.navigate(['/'])
      },
      error: () => {
        this.translateService.get('PAYMENT_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Build the form group.
   *
   * @returns FormGroup
   */
  private buildFormGroup(): FormGroup {
    const group: CartForm = {
      email: [null, [Validators.required, Validators.email]],
      paymentMethod: [null, [Validators.required]]
    }

    return this.formBuilder.group(group)
  }
}

