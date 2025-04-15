import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpService } from '../app/shared/http/service/http.service';
import { BASE_API_URL } from '../config';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request', () => {
    service.get(`${BASE_API_URL}test`).subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}test`);
    expect(req.request.method).toBe('GET');
  });

  it('should send a POST request', () => {
    const mockData = { key: 'value' };
    service.post(`${BASE_API_URL}test`, mockData).subscribe();
    const req = httpMock.expectOne(`${BASE_API_URL}test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
  });
});
