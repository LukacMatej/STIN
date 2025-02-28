import {FormControl} from '@angular/forms'
import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoAddressModel} from './person-info-address.model'

export interface PersonInfoAddressForm {
  country: unknown
  city: unknown
  street: unknown
  houseNumber: unknown
  zipCode: unknown
}

export interface PersonInfoAddressFormValue {
  country: Nullable<string>
  city: Nullable<string>
  street: Nullable<string>
  houseNumber: Nullable<string>
  zipCode: Nullable<string>
}

export function PersonInfoAddressFormValue(model: PersonInfoAddressModel): PersonInfoAddressFormValue {
  return {
    country: model.country,
    city: model.city,
    street: model.street,
    houseNumber: model.houseNumber,
    zipCode: model.zipCode
  }
}

export function isPersonAddressEqual(
  formValue1: Nullable<PersonInfoAddressFormValue>,
  formValue2: Nullable<PersonInfoAddressFormValue>
): boolean {
  return formValue1?.country === formValue2?.country &&
    formValue1?.city === formValue2?.city &&
    formValue1?.street === formValue2?.street &&
    formValue1?.houseNumber === formValue2?.houseNumber &&
    formValue1?.zipCode === formValue2?.zipCode
}

export interface PersonInfoAddressFormGroup {
  country: FormControl<Nullable<string>>
  city: FormControl<Nullable<string>>
  street: FormControl<Nullable<string>>
  houseNumber: FormControl<Nullable<string>>
  zipCode: FormControl<Nullable<string>>
}


