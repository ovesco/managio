import Field from './Field';
import { getType } from './TypeMatcher';
import AbstractRelation from "./Fields/AbstractRelation";

class DocumentDefinition {
  public readonly fields: Map<string, Field> = new Map();

  constructor(private constructor: Function, public readonly collectionName: string) {
  }

  addField(key: string, target: any) {
    this.fields.set(key, new Field(key, getType(key, target)));
  }

  addRelation(key: string, relation: AbstractRelation) {
    this.fields.set(key, new Field(key, relation));
  }
}

export default DocumentDefinition;