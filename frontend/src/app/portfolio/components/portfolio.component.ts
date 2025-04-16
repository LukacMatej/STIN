import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core'
import {TranslateModule, TranslateService} from '@ngx-translate/core'
import {StockModel} from '../model/stock.model'
import {PortfolioService} from '../service/portfolio.service'
import {Nullable} from 'primeng/ts-helpers'
import {ColumnDefModel} from '../../shared/filter/model/column-def.model'
import {StockFilterModel} from '../model/stock.filter.model'
import {FilterComponent} from '../../shared/filter/component/filter.component'
import {FilterOperatorEnum} from '../../shared/filter/valueobject/filter-operator.enum'
import {FilterCriteriaModel} from '../../shared/filter/model/filter-criteria.model'

const CONFIG_NAME = 'stock-list'


@Component({
  selector: 'app-person-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    FilterComponent
  ],
  providers: [],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  private translateService = inject(TranslateService)
  private portfolioService = inject(PortfolioService)
  protected stockFilter: StockFilterModel = StockFilterModel.createDefaultFilter(CONFIG_NAME)
  protected stocks: WritableSignal<Nullable<StockModel[]>> = signal(null)
  protected columns: WritableSignal<ColumnDefModel[]> = signal([])

  /**
   * Initializes the component. If the user info is already created, it will be loaded and displayed.
   */
  ngOnInit(): void {
    this.portfolioService.getStocks().subscribe({
      next: (response) => {
        this.stocks.set(this.parseStocks(response))
      },
      error: (error) => {
        console.error('Error fetching stocks:', error)
      }
    })
    this.columns.set([
      new ColumnDefModel('rating', 'rating', 'string',
        new FilterCriteriaModel(FilterOperatorEnum.ILIKE, this.stockFilter.rating?.value)),
      new ColumnDefModel('newsCounter', 'newsCounter', 'string',
        new FilterCriteriaModel(FilterOperatorEnum.ILIKE, this.stockFilter.newsCounter?.value)),
    ])
    console.log(this.stocks())
    this.filterStocks()
  }
  filterStocksWithColumnDef(columnDef: ColumnDefModel[]) {
    this.stockFilter = ColumnDefModel.prepareColumns(columnDef, this.stockFilter)
    this.filterStocks()
  }

  private filterStocks(): void {
    sessionStorage.setItem(CONFIG_NAME, JSON.stringify(this.stockFilter))
    this.portfolioService.filterStocks(this.stockFilter).subscribe((response) => {
      this.stocks.set(this.parseStocks(response))
    })
  }
  parseStocks(response: any): StockModel[] {
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error('Invalid data format: response does not contain stocks array', response);
      return [];
    }

    const stocks = response.data;
    return stocks.map((stock: any) => ({
      symbol: stock.symbol || null,
      name: stock.name || null,
      price: stock.price || null,
      news: Array.isArray(stock.news) && stock.news.length > 0 ? stock.news : [],
      rating: Number(stock.rating) || null,
      newsCounter: Array.isArray(stock.news) ? stock.news.length : 0,
      recommendation: stock.recommendation || null
    }))
    this.filterStocks()
  }
}
