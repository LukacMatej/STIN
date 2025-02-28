import {EnumColumnTypeModel} from './enum-column-type.model'
import {FilterCriteriaModel} from './filter-criteria.model'

export type ColumnType = 'string' | EnumColumnTypeModel | 'date'
export type FilterConfig = Record<string, number | FilterCriteriaModel | null>

/**
 * Model representing a column definition. Used for filtering data in a table.
 */
export class ColumnDefModel {
  placeholder: string
  name: string
  type: ColumnType
  filterCriteria: FilterCriteriaModel

  constructor(placeholder: string, name: string, type: ColumnType, filterCriteria: FilterCriteriaModel) {
    this.placeholder = placeholder
    this.name = name
    this.type = type
    this.filterCriteria = filterCriteria
  }

  static prepareColumns<T>(columnDefs: ColumnDefModel[], filterConfig: FilterConfig): T {
    const keyNames = Object.keys(filterConfig)
    keyNames.forEach((keyName: string) => {
      const filterCriteria = columnDefs.find(value => value.name === keyName)?.filterCriteria
      if (filterCriteria) {
        if (filterCriteria.value === '' || filterCriteria.value === null || filterCriteria.value.length === 0) {
          filterConfig[keyName] = null
        } else {
          filterConfig[keyName] = filterCriteria
        }
      }
    })
    filterConfig['page'] = 0
    return filterConfig as T
  }
}
