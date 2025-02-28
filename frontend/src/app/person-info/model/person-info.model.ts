import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoFormValue} from './person-info.form'
import {PersonInfoAddressModel} from './person-info-address.model'
import {PersonInfoCategoryModel} from './person-info-category.model'

export interface PersonInfoModel {
  gender: Nullable<string>
  birthDate: Nullable<Date>
  referenceSource: Nullable<string>
  processingConsent: Nullable<boolean>
  personalAddress: Nullable<PersonInfoAddressModel>
  billingAddress: Nullable<PersonInfoAddressModel>
  favoriteCategories: PersonInfoCategoryModel[]
}

export function PersonInfoModel(formValue: PersonInfoFormValue): PersonInfoModel {
  return {
    gender: formValue.gender,
    birthDate: formValue.birthDate,
    referenceSource: formValue.referenceSource,
    processingConsent: formValue.processingConsent,
    personalAddress: formValue.personalAddress,
    billingAddress: formValue.billingAddress,
    favoriteCategories: formValue.favoriteCategories.map(category => PersonInfoCategoryModel(category))
  }
}


