import Field from './Field';
import { getType, getNativeType } from './TypeMatcher';
import AbstractRelation from './Fields/AbstractRelation';
import InvalidTypeError from '../Errors/InvalidTypeError';
import InvalidSchemaDefinitionError from '../Errors/InvalidSchemaDefinitionError';
import IdType from './Fields/IdType';
import RevType from './Fields/RevType';
import KeyType from './Fields/KeyType';
import Schema from './Schema';
import { RepositoryType } from '../Types';

export interface DocumentOptions {
  collectionName: string,
  repositoryClass?: RepositoryType,
}

class DocumentDefinition {

  private $idField: Field = null;

  private $keyField: Field = null;

  private $revField: Field = null;

  private $fields: Map<string, Field> = new Map();

  private $relations: Map<string, Field> = new Map();

  constructor(public readonly constructor: Function, public readonly collectionName: string,
    public readonly options: DocumentOptions) {}

  get fields() {
    return this.$fields;
  }

  get keyField() {
    return this.$keyField;
  }

  get idField() {
    return this.$idField;
  }

  get revField() {
    return this.$revField;
  }

  get relations() {
    return this.$relations;
  }

  // eslint-disable-next-line
  validate(schema: Schema) {
    if (this.$keyField === null) {
      throw new InvalidSchemaDefinitionError(this.constructor, 'Missing at least a key field');
    }
  }

  addField(key: string, target: any) {
    this.$fields.set(key, new Field(key, getType(key, target)));
  }

  addIdField(key: string, target: any) {
    if (getNativeType(key, target) !== String) {
      throw new InvalidTypeError('id', key, target);
    }
    this.$idField = new Field(key, new IdType());
  }

  addKeyField(key: string, target: any) {
    if (getNativeType(key, target) !== Number) {
      throw new InvalidTypeError('key', key, target);
    }
    this.$keyField = new Field(key, new KeyType());
  }

  addrevField(key: string, target: any) {
    if (getNativeType(key, target) !== String) {
      throw new InvalidTypeError('rev', key, target);
    }
    this.$revField = new Field(key, new RevType());
  }

  addRelation(key: string, relation: AbstractRelation) {
    this.$relations.set(key, new Field(key, relation));
  }
}

export default DocumentDefinition;
