import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoFormValue} from './person-info.form'

export interface PersonInfoModel {
  gender: Nullable<string>
  birthDate: Nullable<Date>
}

export function PersonInfoModel(formValue: PersonInfoFormValue): PersonInfoModel {
  return {
    gender: formValue.gender,
    birthDate: formValue.birthDate,
  }
}


