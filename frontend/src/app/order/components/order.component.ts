import {animate, state, style, transition, trigger} from '@angular/animations'
import {NgIf} from '@angular/common'
import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core'
import {MatIconButton} from '@angular/material/button'
import {MatIcon} from '@angular/material/icon'
import {MatPaginator, PageEvent} from '@angular/material/paginator'
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
import {TranslateModule} from '@ngx-translate/core'
import moment from 'moment/moment'

import {FilterComponent} from '../../shared/filter/component/filter.component'
import {ColumnDefModel} from '../../shared/filter/model/column-def.model'
import {FilterCriteriaModel} from '../../shared/filter/model/filter-criteria.model'
import {PageResponseModel} from '../../shared/filter/model/page-response.model'
import {FilterOperatorEnum} from '../../shared/filter/valueobject/filter-operator.enum'
import {CartFilterModel} from '../model/cart-filter.model'
import {CartTableModel} from '../model/cart-table.model'
import {OrderService} from '../service/order.service'

const CONFIG_NAME = 'order-list'

/**
 * Component for the order.
 */
@Component({
  selector: 'app-order',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FilterComponent,
    NgIf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    TranslateModule,
    MatIconButton,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatCellDef,
    MatHeaderCellDef
  ],
  providers: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService)
  protected orderFilter = CartFilterModel.createDefaultFilter(CONFIG_NAME)
  protected orders: WritableSignal<PageResponseModel<CartTableModel> | null> = signal(null)
  protected columns: WritableSignal<ColumnDefModel[]> = signal([])
  protected expandedElement: CartTableModel | null = null

  protected readonly moment = moment
  protected readonly orderItemColumnsToDisplay = ['bookName', 'quantity', 'price']
  protected readonly orderColumnsToDisplayWithExpand = ['id', 'paymentMethod', 'totalPrice', 'createdDateTime', 'expand']

  ngOnInit(): void {
    this.columns.set([
      /*      new ColumnDefModel('SEARCH_PAYMENT_METHOD', 'paymentMethod', paymentMethods,
       new FilterCriteriaModel(FilterOperatorEnum.EQUAL, this.orderFilter.paymentMethod?.value)),*/
      new ColumnDefModel('SEARCH_TOTAL_PRICE', 'totalPrice', 'string',
        new FilterCriteriaModel(FilterOperatorEnum.EQUAL, this.orderFilter.totalPrice?.value))
    ])

    this.filterOrders()
  }

  private filterOrders(): void {
    sessionStorage.setItem(CONFIG_NAME, JSON.stringify(this.orderFilter))
    this.orderService.filterOrders(this.orderFilter).subscribe((response) => {
      this.orders.set(response)
    })
  }

  onChangePage(event: PageEvent) {
    this.orderFilter.size = event.pageSize
    this.orderFilter.page = event.pageIndex
    this.filterOrders()
  }

  filterBooksWithColumnDef(columnDef: ColumnDefModel[]) {
    this.orderFilter = ColumnDefModel.prepareColumns(columnDef, this.orderFilter)
    this.filterOrders()
  }
}

