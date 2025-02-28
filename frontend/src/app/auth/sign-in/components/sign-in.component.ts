import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatCard} from '@angular/material/card'
import {MatCheckbox} from '@angular/material/checkbox'
import {MatFormField} from '@angular/material/form-field'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {Router} from '@angular/router'
import {TranslateModule, TranslateService} from '@ngx-translate/core'

import {NotificationService} from '../../../shared/notification/notification.service'
import {AuthService} from '../../service/auth.service'
import {SignInForm, SignInFormGroup} from '../model/sign-in.form'
import {SignInModel} from '../model/sign-in.model'

/**
 * Component for the sign-in form.
 */
@Component({
  selector: 'app-sign-in',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatIcon,
    MatInput,
    MatButton,
    MatCheckbox,
    TranslateModule
  ],
  templateUrl: 'sign-in.component.html',
  styleUrl: '../../style/auth.component.css',
  providers: [
    AuthService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SignInComponent
    }
  ]
})
export class SignInComponent {
  private formBuilder: FormBuilder = inject(FormBuilder)
  private authService: AuthService = inject(AuthService)
  private notificationService: NotificationService = inject(NotificationService)
  private translate: TranslateService = inject(TranslateService)
  private router: Router = inject(Router)

  public formGroup: FormGroup<SignInFormGroup> = this.buildFormGroup()

  /**
   * Method to handle the form submission, validates the form and calls the sign-in method of the AuthService.
   */
  onSubmit() {
    if (this.formGroup.valid) {
      const signInModel = SignInModel(this.formGroup.getRawValue())
      this.authService.signIn(signInModel).subscribe({
        next: () => {
          this.translate.get('auth.loginSuccess').subscribe((res: string) => {
            this.notificationService.successNotification(res)
          })
          this.router.navigate(['/'])
        },
        error: () => {
          this.translate.get('auth.loginError').subscribe((res: string) => {
            this.notificationService.errorNotification(res)
          })
        }
      })
    } else {
      this.translate.get('auth.formError').subscribe((res: string) => {
        this.notificationService.errorNotification(res)
      })
    }
  }

  /**
   * Method to navigate to the sign-up page.
   */
  openSignUpForm() {
    this.router.navigate(['/sign-up'])
  }

  /**
   * Creates a form group with the required form fields and validators.
   *
   * @returns A form group containing the email, password, and rememberMe fields.
   */
  private buildFormGroup(): FormGroup {
    const form: SignInForm = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    }
    return this.formBuilder.group(form)
  }
}
