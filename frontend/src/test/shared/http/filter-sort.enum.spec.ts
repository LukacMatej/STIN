import { FilterSortEnum } from '../../../app/shared/filter/valueobject/filter-sort.enum';

describe('FilterSortEnum', () => {
  it('should have ASC as "ASC"', () => {
    expect(FilterSortEnum.ASC).toBe('ASC');
  });

  it('should have DESC as "DESC"', () => {
    expect(FilterSortEnum.DESC).toBe('DESC');
  });

  it('should contain only two keys', () => {
    expect(Object.keys(FilterSortEnum).length).toBe(2);
  });

  it('should contain ASC and DESC as keys', () => {
    expect(Object.keys(FilterSortEnum)).toEqual(['ASC', 'DESC']);
  });
});
