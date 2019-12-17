import ColumnType from './ColumnType';

class NumberType extends ColumnType {
  validateValue(value: any): boolean {
    return typeof value === 'number';
  }
}

export default NumberType;
