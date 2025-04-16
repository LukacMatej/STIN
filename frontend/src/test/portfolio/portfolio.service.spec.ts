import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PortfolioService } from '../../app/portfolio/service/portfolio.service';
import { BASE_API_URL } from '../../config';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioService],
    });
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch portfolio data', () => {
    service.getStocks().subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}stocks`); // Changed 'portfolio' to 'stocks'
    expect(req.request.method).toBe('GET');
  });
});
