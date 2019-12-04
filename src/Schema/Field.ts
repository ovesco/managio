import AbstractType from './Fields/AbstractType';

class Field {
  constructor(public readonly key: string, public readonly type: AbstractType) {
  }
}

export default Field;