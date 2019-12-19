import Field from './Field';
import { getType, getNativeType } from './TypeMatcher';
import InvalidTypeError from '../Errors/InvalidTypeError';
import InvalidSchemaDefinitionError from '../Errors/InvalidSchemaDefinitionError';
import IdType from './Fields/IdType';
import RevType from './Fields/RevType';
import KeyType from './Fields/KeyType';
import Schema from './Schema';
import ColumnType, { columnConfig } from './Fields/ColumnType';
import RequiredValueError from '../Errors/RequiredValueError';

abstract class AbstractDefinition {

  protected $idField: Field<IdType> = null;

  protected $keyField: Field<KeyType> = null;

  protected $revField: Field<RevType> = null;

  protected $fields: Map<string, Field<ColumnType>> = new Map();

  constructor(public readonly constructor: Function, public readonly collectionName: string,
    protected readonly $options: object) {}

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

  // eslint-disable-next-line
  checkAndFinalize(schema: Schema) {
    if (this.$keyField === null) {
      throw new InvalidSchemaDefinitionError(this.constructor, 'Missing at least a key field');
    }
  }

  validate(item: object) {
    const plainItem = { ...item };
    this.fields.forEach((field) => {
      const { config } = field.type;
      const value = plainItem[field.key];
      if (value === null || value === undefined) {
        if (config.required) {
          throw new RequiredValueError(item.constructor, field.key);
        }
      } else {
        field.type.validateValue(value);
      }
    });
  }

  addField(key: string, target: any, options: columnConfig) {
    this.$fields.set(key, new Field(key, getType(key, target, options)));
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
}

export default AbstractDefinition;
