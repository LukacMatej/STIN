import {SignInFormValue} from './sign-in.form'

export interface SignInModel {
  email: string | null;
  password: string | null;
  rememberMe: boolean;
}

export function SignInModel(formGroup: SignInFormValue): SignInModel {
  return {
    email: formGroup.email,
    password: formGroup.password,
    rememberMe: formGroup.rememberMe
  }
}
