import {NgIf} from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MatOption} from '@angular/material/autocomplete'
import {MatIcon} from '@angular/material/icon'
import {MatFormField, MatSelect} from '@angular/material/select'
import {MatSlideToggle} from '@angular/material/slide-toggle'
import {MatToolbar} from '@angular/material/toolbar'
import {NavigationEnd, Router, RouterLink} from '@angular/router'
import {TranslateModule, TranslateService} from '@ngx-translate/core'
import {Nullable} from 'primeng/ts-helpers'
import {filter, Subscription} from 'rxjs'

import {AuthUserModel} from '../../../auth/model/auth-user.model'
import {AuthService} from '../../../auth/service/auth.service'
import {LangEnum} from '../valueobject/lang.enum'

@Component({
  selector: 'app-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    MatIcon,
    MatToolbar,
    RouterLink,
    MatOption,
    MatSelect,
    MatFormField,
    ReactiveFormsModule,
    NgIf,
    MatSlideToggle,
    FormsModule
  ],
  providers: [
    Router,
    AuthService
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router)
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef)
  private authService: AuthService = inject(AuthService)
  private translate: TranslateService = inject(TranslateService)

  private subscriptions: Subscription[] = []
  private currentUrl = ''

  protected lang: LangEnum = LangEnum.CZ
  protected isUserSignedIn: WritableSignal<boolean> = signal(false)
  protected authUser: WritableSignal<Nullable<AuthUserModel>> = signal(null)

  /**
   * Initializes the component by setting up the language, current URL, and user details.
   * Loads the saved language from localStorage, defaulting to 'cz' if no language is saved.
   */
  ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'CZ'
    this.translate.use(savedLang)

    this.currentUrl = this.router.url
    this.navigationRouter()

    this.isUserSignedIn.set(this.authService.isSignedIn())
    this.getUser()
  }

  /**
   * Cleans up all subscriptions when the component is destroyed. This prevents memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  /**
   * Checks if the user is signed in, and if so, fetches the user details from the backend and
   * stores them in the session storage.
   */
  getUser(): void {
    if (this.isUserSignedIn() && this.authUser() === null) {
      this.authService.getAuthUser().subscribe((response) => {
        sessionStorage.setItem('user', JSON.stringify(response))
        this.authUser.set(response)
      })
    } else if (!this.isUserSignedIn()) {
      sessionStorage.removeItem('user')
      this.authUser.set(null)
    }
  }

  /**
   * Checks if the current URL is the same as the navigation URL.
   *
   * @param navigationUrl The URL to compare with the current URL.
   * @returns True if the current URL is the same as the navigation URL, false otherwise.
   */
  isSelected(navigationUrl: string) {
    return this.currentUrl == navigationUrl
  }

  /**
   * Signs out the user by calling the signOut method from the AuthService.
   *
   * Sets the isUserSignedIn signal to false and the authUser signal to null.
   */
  signOut() {
    this.authService.signOut()
    this.isUserSignedIn.set(false)
    this.getUser()
  }

  /**
   * Toggles the language between Czech and English based on the provided isChecked value.
   *
   * @param isChecked The value to determine the language to switch to.
   */
  changeLang(isChecked: boolean) {
    const lang = isChecked ? 'EN' : 'CZ'
    this.translate.use(lang)
    this.lang = LangEnum[lang]
    localStorage.setItem('lang', lang)
  }

  /**
   * Manually triggers change detection to update the view when the language is changed.
   */
  private navigationRouter() {
    this.subscriptions.push(this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.isUserSignedIn.set(this.authService.isSignedIn())
      this.getUser()
      this.currentUrl = (event as NavigationEnd).url
      this.changeDetectorRef.detectChanges()
    }))
  }
}

