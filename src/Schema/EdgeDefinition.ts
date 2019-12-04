import DocumentDefinition from './DocumentDefinition';

class EdgeDefinition extends DocumentDefinition {
  constructor(className: Function, collectionName: string, private from: Function, private to: Function) {
    super(className, collectionName);
  }
}

export default EdgeDefinition;