import ColumnType from './ColumnType';

class BooleanType extends ColumnType {
  validateValue(value: any): boolean {
    return typeof value === 'boolean';
  }
}

export default BooleanType;
