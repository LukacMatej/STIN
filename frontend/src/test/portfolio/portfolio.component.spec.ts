import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioComponent } from '../../app/portfolio/components/portfolio.component';
import { PortfolioService } from '../../app/portfolio/service/portfolio.service';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { StockModel } from '../../app/portfolio/model/stock.model';
import { ColumnDefModel } from '../../../src/app/shared/filter/model/column-def.model';
import { FilterCriteriaModel } from '../../../src/app/shared/filter/model/filter-criteria.model';
import { FilterOperatorEnum } from '../../../src/app/shared/filter/valueobject/filter-operator.enum';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let portfolioServiceMock: any;
  let translateServiceMock: any;

  beforeEach(async () => {
    // Initialize mocks with proper return values
    portfolioServiceMock = {
      getStocks: jest.fn().mockReturnValue(of({ data: [] })),
      filterStocks: jest.fn().mockReturnValue(of({ data: [] })),
      httpService: {}
    };

    translateServiceMock = {
      instant: jest.fn(),
      store: {},
      currentLoader: {},
      compiler: {},
      parser: {},
      getBrowserLang: jest.fn(),
      getBrowserCultureLang: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stocks and columns on ngOnInit', () => {
    // Mock data in correct format
    const mockStocksResponse = {
      data: [
        { symbol: 'AAPL', name: 'Apple', price: 150, news: [], rating: 4.5 }
      ]
    };
    
    // Set up the mock to return our test data
    portfolioServiceMock.getStocks.mockReturnValue(of(mockStocksResponse));
    portfolioServiceMock.filterStocks.mockReturnValue(of(mockStocksResponse));

    component.ngOnInit();

    // Use type assertion to access protected properties
    expect((component as any).stocks()).toEqual([
      { symbol: 'AAPL', name: 'Apple', price: 150, news: [], rating: 4.5, newsCounter: 0, recommendation: null }
    ]);
    
    // Use type assertion to access protected properties
    const columns = (component as any).columns();
    expect(columns.length).toBe(2);
    expect(columns[0].name).toBe('SEARCH_RATING');
    expect(columns[0].property).toBe('rating');
    expect(columns[1].name).toBe('SEARCH_NEWSCOUNTER');
    expect(columns[1].property).toBe('newsCounter');
  });

  it('should handle error when fetching stocks', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock error for getStocks
    portfolioServiceMock.getStocks.mockReturnValue(throwError(() => new Error('Network error')));
    
    // Make sure filterStocks still returns something valid to avoid secondary errors
    portfolioServiceMock.filterStocks.mockReturnValue(of({ data: [] }));

    component.ngOnInit();

    expect(portfolioServiceMock.getStocks).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching stocks:', expect.any(Error));
  });

  it('should filter stocks based on column definitions', () => {
    // Prepare mock response for filterStocks
    const mockFilteredStocksResponse = {
      data: [
        { symbol: 'GOOG', name: 'Google', price: 2800, news: [], rating: 4.8 }
      ]
    };
    
    portfolioServiceMock.filterStocks.mockReturnValue(of(mockFilteredStocksResponse));

    const columnDefs = [
      new ColumnDefModel('SEARCH_RATING', 'rating', 'string',
        new FilterCriteriaModel(FilterOperatorEnum.ILIKE, '4.8'))
    ];

    component.filterStocksWithColumnDef(columnDefs);

    // Use type assertion to access protected property
    expect(portfolioServiceMock.filterStocks).toHaveBeenCalledWith((component as any).stockFilter);
    expect((component as any).stocks()).toEqual([
      { symbol: 'GOOG', name: 'Google', price: 2800, news: [], rating: 4.8, newsCounter: 0, recommendation: null }
    ]);
  });

  it('should parse stocks correctly', () => {
    const mockResponse = {
      data: [
        { symbol: 'MSFT', name: 'Microsoft', price: 300, news: [{ title: 'News 1' }], rating: 4.7, recommendation: 'Buy' }
      ]
    };

    // Use type assertion to access protected method
    const parsedStocks = (component as any).parseStocks(mockResponse);

    expect(parsedStocks).toEqual([
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        price: 300,
        news: [{ title: 'News 1' }],
        rating: 4.7,
        newsCounter: 1,
        recommendation: 'Buy'
      }
    ]);
  });

  it('should return an empty array for invalid stock response', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const invalidResponse = { invalid: 'data' };

    // Use type assertion to access protected method
    const parsedStocks = (component as any).parseStocks(invalidResponse);

    expect(parsedStocks).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Invalid data format: response does not contain stocks array', invalidResponse);
  });
});