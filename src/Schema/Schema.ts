import DocumentDefinition from "./DocumentDefinition";
import EdgeDefinition from "./EdgeDefinition";

class Schema {

  public readonly documents: Map<Function, DocumentDefinition> = new Map();

  public readonly edges: Map<Function, EdgeDefinition> = new Map();

  registerDocument(className: Function, collectionName: string) {
    this.documents.set(className, new DocumentDefinition(className, collectionName));
  }

  registerEdge(className: Function, collectionName: string, from: Function, to: Function) {
    this.edges.set(className, new EdgeDefinition(className, collectionName, from, to));
  }

  getDefinition(className: Function): DocumentDefinition | EdgeDefinition {
    const result = this.$getDefinition(className);
    if (result !== null) return result;
    throw new Error('Unknown class definition for ' + className.toString());
  }

  private $getDefinition(className: Function) {
    if (this.documents.has(className)) return this.documents.get(className);
    else if(this.edges.has(className)) return this.edges.get(className);
    return null;
  }
}

export default Schema;
