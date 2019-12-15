import AbstractType from './AbstractType';

class EdgeNodeType extends AbstractType {
  constructor(public readonly target: Function) {
    super();
  }
}

export default EdgeNodeType;
