import {HttpClient} from '@angular/common/http';
import {HttpService} from '../../../app/shared/http/service/http.service';
import {of} from 'rxjs';
import {TestBed} from '@angular/core/testing';

let httpClientMock: jest.Mocked<HttpClient>;
let service: HttpService;

beforeEach(() => {
  httpClientMock = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<HttpClient>;

  TestBed.configureTestingModule({
    providers: [
      HttpService,
      {provide: HttpClient, useValue: httpClientMock},
    ],
  });

  service = TestBed.inject(HttpService);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should perform GET request', () => {
  const mockData = {id: 1, name: 'Test'};
  const url = '/api/test';

  httpClientMock.get.mockReturnValueOnce(of(mockData));

  service.get(url).subscribe((data) => {
    expect(data).toEqual(mockData);
  });

  expect(httpClientMock.get).toHaveBeenCalledWith(url, {});
});

it('should perform POST request', () => {
  const mockData = {id: 1, name: 'Test'};
  const url = '/api/test';
  const body = {name: 'Test'};

  httpClientMock.post.mockReturnValueOnce(of(mockData));

  service.post(url, body).subscribe((data) => {
    expect(data).toEqual(mockData);
  });

  expect(httpClientMock.post).toHaveBeenCalledWith(url, body, {});
});

it('should perform PUT request', () => {
  const mockData = {id: 1, name: 'Updated'};
  const url = '/api/test';
  const body = {name: 'Updated'};

  httpClientMock.put.mockReturnValueOnce(of(mockData));

  service.put(url, body).subscribe((data) => {
    expect(data).toEqual(mockData);
  });

  expect(httpClientMock.put).toHaveBeenCalledWith(url, body, {});
});

it('should perform DELETE request', () => {
  const mockData = {success: true};
  const url = '/api/test';

  httpClientMock.delete.mockReturnValueOnce(of(mockData));

  service.delete(url).subscribe((data) => {
    expect(data).toEqual(mockData);
  });

  expect(httpClientMock.delete).toHaveBeenCalledWith(url, {});
});
