import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Router} from '@angular/router'
import {catchError, Observable, throwError} from 'rxjs'

import {AuthService} from '../../../auth/service/auth.service'
import {NotificationService} from '../../notification/notification.service'

/**
 * Interceptor to handle HTTP errors such as 401 unauthorized.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.authService.invokeRefreshToken().subscribe({
            error: () => {
              this.authService.signOut()
              this.notificationService.errorNotification('You do not have access to this feature, please login')
              sessionStorage.removeItem('auth')
              this.router.navigate(['/sign-in'])
            }
          })
        }
        return throwError(() => error)
      })
    )
  }
}
