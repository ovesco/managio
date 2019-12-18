import { plainToClass } from 'class-transformer';

import ColumnType from './ColumnType';
import { ClassType } from '../../Types';

class EmbeddedType extends ColumnType {
  constructor(options, public typeClass: ClassType) {
    super(options);
  }

  toArangoData(value: object): any {
    return { ...value };
  }

  fromArangoData(value: object): any {
    return plainToClass(this.typeClass, value);
  }
}

export default EmbeddedType;
