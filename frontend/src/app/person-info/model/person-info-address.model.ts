import {Nullable} from 'primeng/ts-helpers'

import {PersonInfoAddressFormValue} from './person-info-address.form'

export interface PersonInfoAddressModel {
  country: Nullable<string>
  city: Nullable<string>
  street: Nullable<string>
  houseNumber: Nullable<string>
  zipCode: Nullable<string>
}

export function PersonInfoAddressModel(formValue: PersonInfoAddressFormValue): PersonInfoAddressModel {
  return {
    country: formValue.country,
    city: formValue.city,
    street: formValue.street,
    houseNumber: formValue.houseNumber,
    zipCode: formValue.zipCode
  }
}
