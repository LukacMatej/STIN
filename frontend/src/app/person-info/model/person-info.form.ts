import {FormControl} from '@angular/forms'
import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoModel} from './person-info.model'

export interface PersonInfoForm {
  gender: unknown
  birthDate: unknown
}

export interface PersonInfoFormValue {
  gender: Nullable<string>
  birthDate: Nullable<Date>
}

export function PersonInfoFormValue(model: PersonInfoModel): PersonInfoFormValue {
  return {
    gender: model.gender,
    birthDate: model.birthDate,
  }
}

export interface PersonInfoFormGroup {
  gender: FormControl<Nullable<string>>
  birthDate: FormControl<Nullable<Date>>
}
