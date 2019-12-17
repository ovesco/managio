import ColumnType from './ColumnType';

class StringType extends ColumnType {
  validateValue(value: any): boolean {
    return typeof value === 'string';
  }
}

export default StringType;
