import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app/app.module';
import { AppComponent } from '../app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeaderInterceptor } from '../app/shared/http/interceptor/http-header.interceptor';
import { HttpErrorInterceptor } from '../app/shared/http/interceptor/http-error.interceptor';

describe('AppModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  });

  it('should create the AppModule', () => {
    const appModule = TestBed.inject(AppModule);
    expect(appModule).toBeTruthy();
  });

  it('should declare AppComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeInstanceOf(AppComponent);
  });

  it('should provide HTTP_INTERCEPTORS with HttpHeaderInterceptor', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    const hasHttpHeaderInterceptor = interceptors.some(
      interceptor => interceptor instanceof HttpHeaderInterceptor
    );
    expect(hasHttpHeaderInterceptor).toBeTruthy();
  });

  it('should provide HTTP_INTERCEPTORS with HttpErrorInterceptor', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    const hasHttpErrorInterceptor = interceptors.some(
      interceptor => interceptor instanceof HttpErrorInterceptor
    );
    expect(hasHttpErrorInterceptor).toBeTruthy();
  });
});
