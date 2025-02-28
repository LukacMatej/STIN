import {FormControl} from '@angular/forms'


export interface SignUpForm {
  firstName: unknown
  lastName: unknown
  email: unknown
  password: unknown
  secondPassword: unknown
}

export interface SignUpFormValue {
  firstName: string
  lastName: string
  email: string
  password: string
  secondPassword: string
}

export interface SignUpFormGroup {
  firstName: FormControl<string>
  lastName: FormControl<string>
  email: FormControl<string>
  password: FormControl<string>
  secondPassword: FormControl<string>
}
