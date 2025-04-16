import { EnumColumnTypeModel } from '../../../app/shared/filter/model/enum-column-type.model';
import { OptionViewModel } from '../../../app/shared/filter/model/option-view.model';

describe('EnumColumnTypeModel', () => {
  it('should create an instance with given values, keys, and multi', () => {
    const values = ['value1', 'value2'];
    const keys = ['key1', 'key2'];
    const multi = false;

    const model = new EnumColumnTypeModel(values, keys, multi);

    expect(model.values).toEqual(values);
    expect(model.keys).toEqual(keys);
    expect(model.multi).toBe(multi);
  });

  it('should create an instance with multi defaulting to true', () => {
    const values = ['value1', 'value2'];
    const keys = ['key1', 'key2'];

    const model = new EnumColumnTypeModel(values, keys);

    expect(model.multi).toBe(true);
  });

  it('should create an instance from option views', () => {
    const optionViews: OptionViewModel[] = [
      { name: 'option1' },
      { name: 'option2' },
    ];
    const multi = false;

    const model = EnumColumnTypeModel.fromOptionViews(optionViews, multi);

    expect(model.values).toEqual(['option1', 'option2']);
    expect(model.keys).toEqual(['option1', 'option2']);
    expect(model.multi).toBe(multi);
  });

  it('should create an instance from option views with multi defaulting to true', () => {
    const optionViews: OptionViewModel[] = [
      { name: 'option1' },
      { name: 'option2' },
    ];

    const model = EnumColumnTypeModel.fromOptionViews(optionViews);

    expect(model.multi).toBe(true);
  });
});
