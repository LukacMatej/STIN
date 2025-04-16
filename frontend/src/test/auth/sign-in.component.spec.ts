import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {SignInComponent} from '../../app/auth/sign-in/components/sign-in.component';
import {AuthService} from '../../app/auth/service/auth.service';
import {NotificationService} from '../../app/shared/notification/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let translateServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      signIn: jest.fn()
    };
    notificationServiceMock = {
      successNotification: jest.fn(),
      errorNotification: jest.fn()
    };
    translateServiceMock = {
      get: jest.fn((key: string) => of(key))
    };
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SignInComponent,
        FormBuilder,
        {provide: AuthService, useValue: authServiceMock},
        {provide: NotificationService, useValue: notificationServiceMock},
        {provide: TranslateService, useValue: translateServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    });

    component = TestBed.inject(SignInComponent);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    expect(component.formGroup).toBeTruthy();
    expect(component.formGroup.controls.email).toBeTruthy();
    expect(component.formGroup.controls.password).toBeTruthy();
    expect(component.formGroup.controls.rememberMe).toBeTruthy();
  });

  it('should call AuthService.signIn on valid form submission', () => {
    const mockFormValue = {email: 'test@example.com', password: 'password', rememberMe: false};
    component.formGroup.setValue(mockFormValue);

    authServiceMock.signIn.mockReturnValue(of({}));
    component.onSubmit();

    expect(authServiceMock.signIn).toHaveBeenCalledWith(mockFormValue);
    expect(translateServiceMock.get).toHaveBeenCalledWith('auth.loginSuccess');
    expect(notificationServiceMock.successNotification).toHaveBeenCalledWith('auth.loginSuccess');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error notification on AuthService.signIn error', () => {
    const mockFormValue = {email: 'test@example.com', password: 'password', rememberMe: false};
    component.formGroup.setValue(mockFormValue);

    authServiceMock.signIn.mockReturnValue(throwError(() => new Error('Login failed')));
    component.onSubmit();

    expect(authServiceMock.signIn).toHaveBeenCalledWith(mockFormValue);
    expect(translateServiceMock.get).toHaveBeenCalledWith('auth.loginError');
    expect(notificationServiceMock.errorNotification).toHaveBeenCalledWith('auth.loginError');
  });

  it('should show form error notification on invalid form submission', () => {
    component.formGroup.setValue({email: '', password: '', rememberMe: false});
    component.onSubmit();

    expect(translateServiceMock.get).toHaveBeenCalledWith('auth.formError');
    expect(notificationServiceMock.errorNotification).toHaveBeenCalledWith('auth.formError');
  });

  it('should navigate to sign-up page on openSignUpForm call', () => {
    component.openSignUpForm();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sign-up']);
  });
});
