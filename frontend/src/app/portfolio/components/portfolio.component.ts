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


@Component({
  selector: 'app-person-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  private translateService = inject(TranslateService)
  private portfolioService = inject(PortfolioService)
  protected stocks: WritableSignal<Nullable<StockModel[]>> = signal(null)

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
    console.log(this.stocks())
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
      news: Array.isArray(stock.news) ? stock.news : [],
      rating: Number(stock.rating) || null,
      newsCounter: Array.isArray(stock.news) ? stock.news.length : 0,
      recommendation: stock.recommendation || null
    }));
  }
}
