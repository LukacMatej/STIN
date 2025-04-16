import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from '../../../../app/shared/http/interceptor/http-error.interceptor';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { NotificationService } from '../../notification/notification.service';
import { Observable, throwError, of } from 'rxjs';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;
  let mockRequest: HttpRequest<unknown>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['signOut']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['errorNotification']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockRequest = new HttpRequest('GET', '/api/test');

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
    
    // Override the inject calls in the interceptor
    (interceptor as any).authService = mockAuthService;
    (interceptor as any).notificationService = mockNotificationService;
    (interceptor as any).router = mockRouter;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through non-error responses', (done) => {
    const mockResponse = { status: 200 };
    httpHandlerSpy.handle.and.returnValue(of(mockResponse as HttpEvent<unknown>));
    
    interceptor.intercept(mockRequest, httpHandlerSpy).subscribe({
      next: response => {
        expect(response).toEqual(mockResponse);
        done();
      },
      error: () => fail('Expected a successful response, not an error')
    });
  });

  it('should handle 401 unauthorized error', (done) => {
    const mockError = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized'
    });
    httpHandlerSpy.handle.and.returnValue(throwError(() => mockError));
    
    // Mock the sessionStorage.removeItem method
    const sessionStorageSpy = spyOn(sessionStorage, 'removeItem');
    
    interceptor.intercept(mockRequest, httpHandlerSpy).subscribe({
      next: () => fail('Expected an error response, not a successful one'),
      error: error => {
        // Verify error is passed through
        expect(error).toBe(mockError);
        
        // Verify the interceptor performed the expected actions
        expect(mockAuthService.signOut).toHaveBeenCalled();
        expect(mockNotificationService.errorNotification).toHaveBeenCalledWith(
          'You do not have access to this feature, please login'
        );
        expect(sessionStorageSpy).toHaveBeenCalledWith('auth');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/sign-in']);
        done();
      }
    });
  });

  it('should pass through other errors without special handling', (done) => {
    const mockError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    httpHandlerSpy.handle.and.returnValue(throwError(() => mockError));
    
    // Spy on the methods to ensure they are NOT called
    const sessionStorageSpy = spyOn(sessionStorage, 'removeItem');
    
    interceptor.intercept(mockRequest, httpHandlerSpy).subscribe({
      next: () => fail('Expected an error response, not a successful one'),
      error: error => {
        // Verify error is passed through
        expect(error).toBe(mockError);
        
        // Verify the interceptor did NOT perform any special actions
        expect(mockAuthService.signOut).not.toHaveBeenCalled();
        expect(mockNotificationService.errorNotification).not.toHaveBeenCalled();
        expect(sessionStorageSpy).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });
});