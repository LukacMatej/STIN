import {FormControl} from '@angular/forms'
import {Nullable} from 'primeng/ts-helpers'

import {PaymentMethodEnum} from '../valueobject/payment-method.enum'

export interface CartForm {
  email: unknown;
  paymentMethod: unknown;
}

export interface CartFormValue {
  email: Nullable<string>
  paymentMethod: Nullable<string>
}
export interface CartFormGroup {
  email: FormControl<string | null>;
  paymentMethod: FormControl<PaymentMethodEnum | null>;
}
