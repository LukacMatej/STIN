import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../app/shared/notification/notification.service';
import { AuthService } from '../../app/auth/service/auth.service';
import { SignUpComponent } from '../../app/auth/sing-up/components/sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let authService: AuthService;
  let notificationService: NotificationService;
  let translateService: TranslateService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      signUp: jest.fn()
    };
    const notificationServiceMock = {
      successNotification: jest.fn(),
      errorNotification: jest.fn()
    };
    const translateServiceMock = {
      get: jest.fn().mockReturnValue(of(''))
    };
    const routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    component = TestBed.createComponent(SignUpComponent).componentInstance;
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
  });

  it('should initialize the form group', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.controls['firstName']).toBeDefined();
    expect(component.formGroup.controls['lastName']).toBeDefined();
    expect(component.formGroup.controls['email']).toBeDefined();
    expect(component.formGroup.controls['password']).toBeDefined();
    expect(component.formGroup.controls['secondPassword']).toBeDefined();
  });

  it('should call signUp on valid form submission', () => {
    component.formGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      secondPassword: 'password123'
    });

    (authService.signUp as jest.Mock).mockReturnValue(of({}));

    component.onSubmit();

    expect(authService.signUp).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      secondPassword: 'password123'
    });
    expect(translateService.get).toHaveBeenCalledWith('auth.loginSuccess');
    expect(notificationService.successNotification).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });

  it('should show error notification on signUp failure', () => {
    component.formGroup.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      secondPassword: 'password123'
    });

    (authService.signUp as jest.Mock).mockReturnValue(throwError(() => new Error()));

    component.onSubmit();

    expect(translateService.get).toHaveBeenCalledWith('auth.loginError');
    expect(notificationService.errorNotification).toHaveBeenCalled();
  });

  it('should show error notification on invalid form submission', () => {
    component.formGroup.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      secondPassword: ''
    });

    component.onSubmit();

    expect(translateService.get).toHaveBeenCalledWith('auth.formError');
    expect(notificationService.errorNotification).toHaveBeenCalled();
  });

  it('should navigate to sign-in form on openSignInForm call', () => {
    component.openSignInForm();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
