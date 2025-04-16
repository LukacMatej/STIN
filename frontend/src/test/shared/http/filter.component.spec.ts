import { EventEmitter } from '@angular/core';
import { FilterComponent } from '../../../app/shared/filter/component/filter.component';
import { ColumnDefModel, ColumnType } from '../../../app/shared/filter/model/column-def.model';
import { EnumColumnTypeModel } from '../../../app/shared/filter/model/enum-column-type.model';

describe('FilterComponent', () => {
  let component: FilterComponent;

  beforeEach(() => {
    component = new FilterComponent();
    component.columns = [
      { filterCriteria: { value: 'test' } } as ColumnDefModel,
      { filterCriteria: { value: 'example' } } as ColumnDefModel,
    ];
    component.filter = new EventEmitter<ColumnDefModel[]>();
  });

  it('should emit updated columns when applyFilters is called', () => {
    const spy = jest.spyOn(component.filter, 'emit');
    component.applyFilters();
    expect(spy).toHaveBeenCalledWith(component.columns);
  });

  it('should clear all column filters when clearFilters is called', () => {
    component.clearFilters();
    expect(component.columns.every(column => column.filterCriteria.value === null)).toBe(true);
  });

  it('should correctly identify EnumColumnTypeModel in isEnumColumnType', () => {
    const enumColumnType = new EnumColumnTypeModel(['value1', 'value2'], ['key1', 'key2']);
    const nonEnumColumnType = { type: 'string' } as unknown as ColumnType;

    expect(component.isEnumColumnType(enumColumnType)).toBe(true);
    expect(component.isEnumColumnType(nonEnumColumnType)).toBe(false);
  });
});
