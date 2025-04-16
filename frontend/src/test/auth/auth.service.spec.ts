import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../app/auth/service/auth.service';
import { BASE_API_URL } from '../../config';
import { SignInModel } from '../../app/auth/sign-in/model/sign-in.model';
import { SignUpModel } from '../../app/auth/sing-up/model/sign-up.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request for sign-in', () => {
    const mockSignIn: SignInModel = { email: 'test@example.com', password: 'password', rememberMe: true };
    service.signIn(mockSignIn).subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSignIn);
  });

  it('should send a POST request for sign-up', () => {
    const mockSignUp: SignUpModel = { email: 'test@example.com', password: 'password', secondPassword: 'password', firstName: 'John', lastName: 'Doe' }; // Added 'firstName' and 'lastName'
    service.signUp(mockSignUp).subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}auth/registration`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSignUp);
    req.flush({ success: true });
  });

  it('should send a POST request for sign-out', () => {
    service.signOut();
    const req = httpMock.expectOne(`${BASE_API_URL}auth/logout`);
    expect(req.request.method).toBe('POST');
  });

  it('should send a GET request for authenticated user', () => {
    service.getAuthUser().subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}auth/user`);
    expect(req.request.method).toBe('GET');
  });

  it('should check if user is signed in', () => {
    sessionStorage.setItem('auth', 'true');
    expect(service.isSignedIn()).toBeTruthy(); // Replaced toBeTrue with toBeTruthy
    sessionStorage.removeItem('auth');
    expect(service.isSignedIn()).toBeFalsy(); // Replaced toBeFalse with toBeFalsy
  });
});
