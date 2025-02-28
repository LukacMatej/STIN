import {FormControl} from '@angular/forms'

export interface SignInForm {
  email: unknown
  password: unknown
  rememberMe: unknown
}

export interface SignInFormValue {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignInFormGroup {
  email: FormControl<string>
  password: FormControl<string>
  rememberMe: FormControl<boolean>
}
