import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from '../../../app/shared/http/interceptor/http-error.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from '../../../app/shared/notification/notification.service';
import { AuthService } from '../../../app/auth/service/auth.service';

describe('HttpErrorInterceptor', () => {
  let mockHttpErrorInterceptor: HttpErrorInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        NotificationService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });

    mockHttpErrorInterceptor = new HttpErrorInterceptor(
      TestBed.inject(NotificationService),
      TestBed.inject(AuthService)
    );
  });

  it('should create the interceptor', () => {
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(
      (interceptor) => interceptor instanceof HttpErrorInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
