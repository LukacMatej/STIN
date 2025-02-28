import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'

/**
 * Interceptor to add headers to HTTP requests.
 */
@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      withCredentials: true
    })

    return next.handle(request)
  }
}
