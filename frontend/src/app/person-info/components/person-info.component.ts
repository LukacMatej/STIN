import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatCardModule} from '@angular/material/card'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatNativeDateModule} from '@angular/material/core'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {TranslateModule, TranslateService} from '@ngx-translate/core'

import {OptionViewModel} from '../../shared/filter/model/option-view.model'
import {NotificationService} from '../../shared/notification/notification.service'
import {convertEmptyStringToNull} from '../../shared/util/shared-util'
import {PersonInfoForm, PersonInfoFormGroup, PersonInfoFormValue} from '../model/person-info.form'
import {PersonInfoModel} from '../model/person-info.model'
import {PersonInfoService} from '../service/person-info.service'

@Component({
  selector: 'app-person-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatNativeDateModule,
    MatInputModule,
    MatButton
  ],
  providers: [
    FormBuilder,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PersonInfoComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PersonInfoComponent
    }
  ],
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.css']
})
export class PersonInfoComponent implements OnInit {
  @Input({required: true}) useValidators = false
  @Output() dataSubmittedEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  private translateService = inject(TranslateService)
  private personInfoService = inject(PersonInfoService)
  private notificationService = inject(NotificationService)
  private formBuilder: FormBuilder = inject(FormBuilder)

  private created = false

  protected formGroup!: FormGroup<PersonInfoFormGroup>
  protected isBillingSameAsPersonal: WritableSignal<boolean> = signal(true)
  protected bookCategories: OptionViewModel[] = []

  /**
   * Initializes the component. If the user info is already created, it will be loaded and displayed.
   */
  ngOnInit(): void {
    this.formGroup = this.buildFormGroup()

    this.getPersonInfo()
  }

  private getPersonInfo() {
    this.personInfoService.getUserInfo().subscribe({
      next: (response) => {
        const formValue = PersonInfoFormValue(response)
        this.formGroup.patchValue(formValue)
        this.created = true
      },
      error: () => {
        this.created = false
        this.isBillingSameAsPersonal.set(false)
      }
    })
  }

  /**
   * Submits the form. If the user info is already created, it will be updated, otherwise it will be created.
   */
  onSubmit(): void {
    this.formGroup.markAllAsTouched()

    if (this.formGroup.invalid) {
      this.translateService.get('INVALID_DATA').subscribe((res: string) => {
        this.notificationService.errorNotification(res)
      })
      return
    }

    const personInfoModel = convertEmptyStringToNull(PersonInfoModel(this.formGroup.getRawValue()))
    if (this.created) {
      this.updatePersonInfo(personInfoModel)
    } else {
      this.createPersonInfo(personInfoModel)
    }
  }

  /**
   * Creates the user info.
   * @param personInfoModel
   * @private
   */
  private createPersonInfo(personInfoModel: PersonInfoModel) {
    this.personInfoService.createUserInfo(personInfoModel).subscribe({
      next: () => {
        this.created = true
        this.dataSubmittedEvent.emit(true)
        this.translateService.get('INFO_POSTED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
      },
      error: () => {
        this.created = false
        this.translateService.get('INFO_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Updates the user info.
   * @param personInfoModel
   * @private
   */
  private updatePersonInfo(personInfoModel: PersonInfoModel) {
    this.personInfoService.updateUserInfo(personInfoModel).subscribe({
      next: () => {
        this.dataSubmittedEvent.emit(true)
        this.translateService.get('INFO_POSTED').subscribe((res: string) => {
          this.notificationService.successNotification(res)
        })
      },
      error: () => {
        this.translateService.get('INFO_ERROR').subscribe((res: string) => {
          this.notificationService.errorNotification(res)
        })
      }
    })
  }

  /**
   * Builds the form group.
   * @private
   */
  private buildFormGroup(): FormGroup {
    const validator = this.useValidators ? [Validators.required] : []
    const group: PersonInfoForm = {
      gender: [null, validator],
      birthDate: [null, validator],
    }

    return this.formBuilder.group(group)
  }
}
