import {FilterOperatorEnum} from '../valueobject/filter-operator.enum'
import {FilterSortEnum} from '../valueobject/filter-sort.enum'

export class FilterCriteriaModel {
  operator: FilterOperatorEnum | null
  value: any | null
  sort: FilterSortEnum | null

  constructor(operator: FilterOperatorEnum | null = null, value: any | null = null, sort: FilterSortEnum | null = null) {
    this.operator = operator
    this.value = value
    this.sort = sort
  }
}
