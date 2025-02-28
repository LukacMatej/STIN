import {HttpResponse} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable, tap} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'
import {AuthUserModel} from '../model/auth-user.model'
import {SignInModel} from '../sign-in/model/sign-in.model'
import {SignUpModel} from '../sing-up/model/sign-up.model'

/**
 * Service to handle user authentication operations such as sign-in, sign-up, and sign-out.
 * Marks the service as injectable and provided at the root level, making it a singleton service accessible throughout the entire application.
 */
@Injectable({providedIn: 'root'})
export class AuthService {

  private httpService: HttpService = inject(HttpService)
  private rootHttpUrl = BASE_API_URL + 'auth/'

  /**
   * Method to handle user sign-in, sends a POST request with the sign-in form data.
   *
   * @param signInModel The sign-in form data containing the user's email, password, and rememberMe option.
   * @returns An observable of the HTTP response containing the status code.
   * @see SignInModel
   */
  signIn(signInModel: SignInModel): Observable<HttpResponse<void>> {
    return this.httpService.post<HttpResponse<void>>(`${this.rootHttpUrl}login`, signInModel).pipe(tap(() => {
      this.setSignedIn()
    }))
  }

  /**
   * Method to handle user sign-up, sends a POST request with the sign-up form data.
   *
   * @param signUpModel The sign-up model data containing the user's name, email, and password.
   * @returns An observable of a boolean value indicating the success of the sign-up operation.
   * @see SignUpModel
   */
  signUp(signUpModel: SignUpModel): Observable<boolean> {
    return this.httpService.post(`${this.rootHttpUrl}registration`, signUpModel)
  }


  /**
   * Method to handle user sign-out, sends a POST request to the logout endpoint and clears the session.
   * Removes the 'auth' session key and reloads the page to reset the application state.
   */
  signOut() {
    this.httpService.post(`${this.rootHttpUrl}logout`, null).subscribe(() => {
      sessionStorage.removeItem('auth')
    })
  }

  /**
   * Method to get the authenticated user's data, sends a GET request to the user endpoint.
   *
   * @returns An observable of the authenticated user's data.
   * @see AuthUserModel
   */
  getAuthUser(): Observable<AuthUserModel> {
    return this.httpService.get(`${this.rootHttpUrl}user`)
  }

  /**
   * Method to check if the user is signed in by checking the 'auth' session key.
   *
   * @returns A boolean value indicating whether the user is signed in.
   */
  isSignedIn() {
    return sessionStorage.getItem('auth') === 'true'
  }

  invokeRefreshToken() {
    return this.httpService.post(`${this.rootHttpUrl}invoke-refresh-token`, null)
  }

  /**
   * Private method to set the 'auth' session key to 'true' upon successful sign-in.
   */
  private setSignedIn() {
    sessionStorage.setItem('auth', 'true')
  }
}
