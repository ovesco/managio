import AbstractType from './Fields/AbstractType';

class Field<T extends AbstractType> {
  constructor(public readonly key: string, public readonly type: T) {
  }
}

export default Field;
