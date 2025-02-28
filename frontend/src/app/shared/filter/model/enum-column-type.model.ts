import {OptionViewModel} from './option-view.model'

export class EnumColumnTypeModel {
  values: string[]
  keys: string[]
  multi: boolean

  constructor(values: string[], keys: string[], multi = true) {
    this.values = values
    this.keys = keys
    this.multi = multi
  }

  static fromOptionViews(optionViews: OptionViewModel[], multi = true): EnumColumnTypeModel {
    const values = optionViews.map((optionView) => optionView.name)
    return new EnumColumnTypeModel(values, values, multi)
  }
}
