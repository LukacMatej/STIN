import {SignUpFormValue} from './sign-up.form'

export interface SignUpModel {
  firstName: string
  lastName: string
  email: string
  password: string
  secondPassword: string
}


export function SignUpModel(formGroup: SignUpFormValue): SignUpModel {
  return {
    firstName: formGroup.firstName,
    lastName: formGroup.lastName,
    email: formGroup.email,
    password: formGroup.password,
    secondPassword: formGroup.secondPassword
  }
}
