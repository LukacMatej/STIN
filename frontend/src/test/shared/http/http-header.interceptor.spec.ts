import {HttpErrorInterceptor} from "../../../app/shared/http/interceptor/http-error.interceptor"
import {NotificationService} from "../../../app/shared/notification/notification.service"
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http"
import {TestBed} from "@angular/core/testing"
import {Observable, throwError} from "rxjs"
import {Router} from "@angular/router"

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let httpHandlerMock: HttpHandler;
  let notificationService: NotificationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: NotificationService, useValue: { notify: jasmine.createSpy('notify') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
    notificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
    httpHandlerMock = {
      handle: jasmine.createSpy('handle').and.returnValue(new Observable<HttpEvent<any>>()),
    };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call notificationService.notify on error', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(new HttpRequest('GET', '/test'), httpHandlerMock).subscribe({
      error: () => {
        expect(notificationService.notify).toHaveBeenCalledWith('An error occurred');
      },
    });
  });

  it('should navigate to login on 401 error', () => {
    const errorResponse = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    (httpHandlerMock.handle as jasmine.Spy).and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(new HttpRequest('GET', '/test'), httpHandlerMock).subscribe({
      error: () => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      },
    });
  });
});
