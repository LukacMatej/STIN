import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from '../../../app/shared/http/interceptor/http-error.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from '../../../app/shared/notification/notification.service';
import { AuthService } from '../../../app/auth/service/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let httpHandlerMock: HttpHandler;
  let notificationService: NotificationService;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: NotificationService, useValue: { errorNotification: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: AuthService, useValue: { signOut: jest.fn() } },
      ],
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
    notificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    httpHandlerMock = {
      handle: jest.fn().mockReturnValue(new Observable<HttpEvent<any>>()),
    };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call notificationService.errorNotification, authService.signOut, and remove sessionStorage item on 401 error', () => {
    const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));
    const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');

    interceptor.intercept(new HttpRequest('GET', '/test'), httpHandlerMock).subscribe({
      error: () => {
        expect(authService.signOut).toHaveBeenCalled();
        expect(notificationService.errorNotification).toHaveBeenCalledWith(
          'You do not have access to this feature, please login'
        );
        expect(removeItemSpy).toHaveBeenCalledWith('auth');
        expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
      },
    });
  });

  it('should not call router.navigate or notificationService.errorNotification on non-401 error', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    (httpHandlerMock.handle as jest.Mock).mockReturnValue(throwError(() => errorResponse));

    interceptor.intercept(new HttpRequest('GET', '/test'), httpHandlerMock).subscribe({
      error: () => {
        expect(notificationService.errorNotification).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      },
    });
  });
});