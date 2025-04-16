import { HttpErrorInterceptor } from "../../../app/shared/http/interceptor/http-error.interceptor";
import { HttpHeaderInterceptor } from "../../../app/shared/http/interceptor/http-header.interceptor";
import { NotificationService } from "../../../app/shared/notification/notification.service";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

describe('HttpHeaderInterceptor', () => {
  let interceptor: HttpHeaderInterceptor;
  let httpHandlerMock: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpHeaderInterceptor,
        { provide: NotificationService, useValue: { errorNotification: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });

    interceptor = TestBed.inject(HttpHeaderInterceptor);
    httpHandlerMock = {
      handle: jest.fn().mockReturnValue(new Observable<HttpEvent<any>>()),
    };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should clone the request with withCredentials: true', () => {
    const request = new HttpRequest('GET', '/test');
    const clonedRequest = request.clone({ withCredentials: true });

    interceptor.intercept(request, httpHandlerMock).subscribe();

    expect(httpHandlerMock.handle).toHaveBeenCalledWith(clonedRequest);
  });
});
