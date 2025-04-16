import { TestBed } from '@angular/core/testing';
import { NavigationComponent } from '../../../app/shared/navigation/components/navigation.component';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../app/auth/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LangEnum } from '../../../app/shared/navigation/valueobject/lang.enum';
import { HttpService } from '../../../app/shared/http/service/http.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let mockRouter: Partial<Router>;
  let mockAuthService: Partial<AuthService>;
  let mockTranslateService: Partial<TranslateService>;
  let mockHttpClient: Partial<HttpClient>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockHttpService: Partial<HttpService>;

  beforeEach(() => {
    mockRouter = {
      url: '/home',
      events: of(new NavigationEnd(1, '/home', '/home')),
    };
    mockAuthService = {
      isSignedIn: jest.fn().mockReturnValue(true),
      getAuthUser: jest.fn().mockReturnValue(of({ id: 1, name: 'Test User' })),
      signOut: jest.fn(),
    };
    mockTranslateService = {
      use: jest.fn(),
    };
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockActivatedRoute = {
      snapshot: {
        params: {},
        url: [],
        queryParams: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        component: null,
        routeConfig: null,
        root: {} as ActivatedRouteSnapshot,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: [],
        paramMap: {} as any,
        queryParamMap: {} as any,
        title: undefined,
      },
    };
    mockHttpService = {
      post: jest.fn().mockReturnValue(of(null)), // Mock HttpService.post
    };

    TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HttpService, useValue: mockHttpService }, // Provide mock HttpService
      ],
    });

    const fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should clean up subscriptions on destroy', () => {
    const unsubscribeSpy = jest.fn();
    component['subscriptions'] = [{ unsubscribe: unsubscribeSpy }] as any;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should remove user details if not signed in', () => {
    jest.spyOn(mockAuthService, 'isSignedIn').mockReturnValue(false);
    const removeItemSpy = jest.spyOn(Object.getPrototypeOf(sessionStorage), 'removeItem').mockImplementation(() => {}); // Mock sessionStorage.removeItem
    component.getUser();

    expect(removeItemSpy).toHaveBeenCalledWith('user'); // Ensure sessionStorage.removeItem is called
    expect(component['authUser']()).toBeNull();
  });

  it('should check if a navigation URL is selected', () => {
    component['currentUrl'] = '/home';
    expect(component.isSelected('/home')).toBe(true);
    expect(component.isSelected('/about')).toBe(false);
  });

  it('should toggle language and save it to localStorage', () => {
    const setItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem'); // Properly spy on localStorage.setItem
    component.changeLang(true);

    expect(mockTranslateService.use).toHaveBeenCalledWith('EN');
    expect(component['lang']).toBe(LangEnum.EN);
    expect(setItemSpy).toHaveBeenCalledWith('lang', 'EN');
  });
});
