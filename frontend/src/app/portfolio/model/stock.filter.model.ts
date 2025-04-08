import {FilterCriteriaModel} from '../../shared/filter/model/filter-criteria.model'


export class StockFilterModel {
  rating: FilterCriteriaModel | null
  newsCounter: FilterCriteriaModel | null
  [prop: string]: number | FilterCriteriaModel | null

  constructor(rating: FilterCriteriaModel | null = null, newsCounter: FilterCriteriaModel | null = null,
  ) {
    this.rating = rating
    this.newsCounter = newsCounter
  }

  static createDefaultFilter(key: string): StockFilterModel {
    if (sessionStorage.getItem(key)) {
      const config = JSON.parse(sessionStorage.getItem(key) as string)
      return new StockFilterModel(
        config.rating,
        config.newsCounter
      )
    }
    return new StockFilterModel()
  }
}
