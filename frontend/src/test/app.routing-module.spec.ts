import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app/app.routing-module';
import { SignInComponent } from '../app/auth/sign-in/components/sign-in.component';
import { SignUpComponent } from '../app/auth/sing-up/components/sign-up.component';
import { PortfolioComponent } from '../app/portfolio/components/portfolio.component';

describe('AppRoutingModule', () => {
  let routes: Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AppRoutingModule],
    });

    const router = TestBed.inject(Router);
    routes = router.config;
  });

  it('should have a route for "sign-in" mapped to SignInComponent', () => {
    const route = routes.find((r) => r.path === 'sign-in');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(SignInComponent);
  });

  it('should have a route for "sign-up" mapped to SignUpComponent', () => {
    const route = routes.find((r) => r.path === 'sign-up');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(SignUpComponent);
  });

  it('should have a route for "portfolio" mapped to PortfolioComponent', () => {
    const route = routes.find((r) => r.path === 'portfolio');
    expect(route).toBeTruthy();
    expect(route?.component).toBe(PortfolioComponent);
  });

  it('should have a wildcard route redirecting to ""', () => {
    const route = routes.find((r) => r.path === '**');
    expect(route).toBeTruthy();
    expect(route?.redirectTo).toBe('');
  });
});
