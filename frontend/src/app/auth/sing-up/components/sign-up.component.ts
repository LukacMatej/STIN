import {NgIf} from '@angular/common'
import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatCard} from '@angular/material/card'
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field'
import {MatIcon} from '@angular/material/icon'
import {MatInput} from '@angular/material/input'
import {Router} from '@angular/router'
import {TranslateModule, TranslateService} from '@ngx-translate/core'

import {NotificationService} from '../../../shared/notification/notification.service'
import {AuthService} from '../../service/auth.service'
import {SignUpForm, SignUpFormGroup} from '../model/sign-up.form'
import {SignUpModel} from '../model/sign-up.model'

/**
 * Component for the sign-up form.
 */
@Component({
  selector: 'app-sign-up',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatLabel,
    NgIf,
    MatError,
    TranslateModule,
    MatInput,
    MatIcon,
    MatButton
  ],
  templateUrl: 'sign-up.component.html',
  styleUrl: '../../style/auth.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SignUpComponent
    }
  ]
})
export class SignUpComponent {
  private formBuilder: FormBuilder = inject(FormBuilder)
  private authService: AuthService = inject(AuthService)
  private notificationService: NotificationService = inject(NotificationService)
  private translate: TranslateService = inject(TranslateService)
  private router: Router = inject(Router)

  public formGroup: FormGroup<SignUpFormGroup> = this.buildFormGroup()

  /**
   * Method to handle the sign-up form submission, validates the form and sends a sign-up request to the server.
   */
  onSubmit() {
    if (this.formGroup.valid) {
      const signUpModel = SignUpModel(this.formGroup.getRawValue())
      this.authService.signUp(signUpModel).subscribe({
        next: () => {
          this.translate.get('auth.loginSuccess').subscribe((res: string) => {
            this.notificationService.successNotification(res)
          })
          this.router.navigate(['/sign-in'])
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
   * Method to navigate to the sign-in form when the user clicks the sign-in button.
   */
  openSignInForm() {
    this.router.navigate(['/sign-in'])
  }

  /**
   * Method to build the form group with the required form controls and validators.
   *
   * @returns The form group containing the form controls.
   */
  private buildFormGroup(): FormGroup {
    const group: SignUpForm = {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      secondPassword: ['', [Validators.required]]
    }

    return this.formBuilder.group(group)
  }
}

