import AbstractType from './AbstractType';

export type columnConfig = {
  required: boolean,
};

abstract class ColumnType extends AbstractType {
  constructor(public readonly config: columnConfig) {
    super();
  }
}

export default ColumnType;
