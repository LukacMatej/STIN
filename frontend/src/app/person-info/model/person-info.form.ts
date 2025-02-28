import {FormControl, FormGroup} from '@angular/forms'
import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoModel} from './person-info.model'
import {PersonInfoAddressFormGroup, PersonInfoAddressFormValue} from './person-info-address.form'

export interface PersonInfoForm {
  gender: unknown
  birthDate: unknown
  referenceSource: unknown
  processingConsent: unknown
  personalAddress: unknown
  billingAddress: unknown
  favoriteCategories: unknown
}

export interface PersonInfoFormValue {
  gender: Nullable<string>
  birthDate: Nullable<Date>
  referenceSource: Nullable<string>
  processingConsent: Nullable<boolean>
  personalAddress: Nullable<PersonInfoAddressFormValue>
  billingAddress: Nullable<PersonInfoAddressFormValue>
  favoriteCategories: string[]
}

export function PersonInfoFormValue(model: PersonInfoModel): PersonInfoFormValue {
  return {
    gender: model.gender,
    birthDate: model.birthDate,
    referenceSource: model.referenceSource,
    processingConsent: model.processingConsent,
    personalAddress: model.personalAddress ? PersonInfoAddressFormValue(model.personalAddress) : null,
    billingAddress: model.billingAddress ? PersonInfoAddressFormValue(model.billingAddress) : null,
    favoriteCategories: model.favoriteCategories.map(category => category.name)
  }
}

export interface PersonInfoFormGroup {
  gender: FormControl<Nullable<string>>
  birthDate: FormControl<Nullable<Date>>
  referenceSource: FormControl<Nullable<string>>
  processingConsent: FormControl<Nullable<boolean>>
  personalAddress: FormGroup<Nullable<PersonInfoAddressFormGroup>>
  billingAddress: FormGroup<Nullable<PersonInfoAddressFormGroup>>
  favoriteCategories: FormControl<string[]>
}
