import AbstractType from './AbstractType';

class EdgeNodeType extends AbstractType {
  private keyProperty: string;

  private collectionName: string;

  constructor(public readonly target: Function) {
    super();
  }

  setTargetSchemaData(collectionName, keyProperty) {
    this.collectionName = collectionName;
    this.keyProperty = keyProperty;
  }

  toArangoData(value: object): any {
    // Dynamically build id
    return `${this.collectionName}/${value[this.keyProperty]}`;
  }
}

export default EdgeNodeType;
