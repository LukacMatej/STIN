import {FilterCriteriaModel} from '../../shared/filter/model/filter-criteria.model'

export class CartFilterModel {
  size: number
  page: number
  paymentMethod: FilterCriteriaModel | null
  totalPrice: FilterCriteriaModel | null
  createdDateTime: FilterCriteriaModel | null
  [prop: string]: number | FilterCriteriaModel | null
  constructor(size: number, page: number, paymentMethod: FilterCriteriaModel | null = null,
              totalPrice: FilterCriteriaModel | null = null, createdDateTime: FilterCriteriaModel | null = null
  ) {
    this.size = size
    this.page = page
    this.paymentMethod = paymentMethod
    this.totalPrice = totalPrice
    this.createdDateTime = createdDateTime
  }

  static createDefaultFilter(key: string): CartFilterModel {
    if (sessionStorage.getItem(key)) {
      const config = JSON.parse(sessionStorage.getItem(key) as string)
      return new CartFilterModel(
        config.size,
        config.page,
        config.paymentMethod,
        config.totalPrice,
        config.createdDateTime
      )
    }
    return new CartFilterModel(9, 0)
  }
}
