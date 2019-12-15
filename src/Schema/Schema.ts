import DocumentDefinition, { DocumentOptions } from './DocumentDefinition';
import EdgeDefinition from './EdgeDefinition';

class Schema {

  public readonly documents: Map<Function, DocumentDefinition> = new Map();

  public readonly edges: Map<Function, EdgeDefinition> = new Map();

  validate() {
    this.documents.forEach((docDef) => {
      docDef.validate(this);
    });
    this.documents.forEach((edgeDef) => {
      edgeDef.validate(this);
    });
  }

  isPartOfSchema(item: object | Function) {
    const constructor = item instanceof Function ? item : item.constructor;
    const definition = this.getDefinition(constructor);
    if (definition === null) throw new Error(`Class ${constructor.name} is not part of defined schema`);
  }

  registerDocument(className: Function, collectionName: string, options: DocumentOptions) {
    this.documents.set(className, new DocumentDefinition(className, collectionName, options));
  }

  registerEdge(className: Function, collectionName: string, options: DocumentOptions) {
    this.edges.set(className, new EdgeDefinition(className, collectionName, options));
  }

  getDefinition(className: Function): EdgeDefinition | DocumentDefinition {
    if (this.documents.has(className)) return this.documents.get(className);
    if (this.edges.has(className)) return this.edges.get(className);
    return null;
  }

  getObjectDefinition(item: object) {
    return this.getDefinition(item.constructor);
  }

  getDocumentDefinition(className: Function): DocumentDefinition {
    if (this.documents.has(className)) return this.documents.get(className);
    return null;
  }

  getEdgeDefinition(className: Function): EdgeDefinition {
    if (this.edges.has(className)) return this.edges.get(className);
    return null;
  }

  hasDefinition(className: Function) {
    return this.getDefinition(className) !== null;
  }
}

export default Schema;
