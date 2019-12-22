import { DocumentOptions } from './DocumentDefinition';
import EdgeNodeType, { EdgeNodeConfig } from './Fields/EdgeNodeType';
import Field from './Field';
import Schema from './Schema';
import InvalidSchemaDefinitionError from '../Errors/InvalidSchemaDefinitionError';
import { CascadeType } from '../Types';
import AbstractDefinition from './AbstractDefinition';

export interface EdgeOptions extends DocumentOptions {
  cascadeFrom: CascadeType,
  cascadeTo: CascadeType,
  selfDiscoverable: boolean,
}

class EdgeDefinition extends AbstractDefinition {
  private $from: Field<EdgeNodeType> = null;

  private $to: Field<EdgeNodeType> = null;

  checkAndFinalize(schema: Schema) {
    super.checkAndFinalize(schema);
    if (this.$from === null) throw new InvalidSchemaDefinitionError(this.constructor, 'No from property found');
    if (this.$to === null) throw new InvalidSchemaDefinitionError(this.constructor, 'No to property found');
    // Insert id field in from and to types
    const fromDef = schema.getDefinition(this.$from.type.target);
    const toDef = schema.getDefinition(this.$to.type.target);
    this.$from.type.setTargetSchemaData(fromDef.collectionName, fromDef.keyField.key);
    this.$to.type.setTargetSchemaData(toDef.collectionName, toDef.keyField.key);
  }

  get options(): EdgeOptions {
    return this.$options as EdgeOptions;
  }

  get from() {
    return this.$from;
  }

  get to() {
    return this.$to;
  }

  setFrom(key: string, target: Function, options: EdgeNodeConfig) {
    this.$from = new Field(key, new EdgeNodeType(target, options));
  }

  setTo(key: string, target: Function, options: EdgeNodeConfig) {
    this.$to = new Field(key, new EdgeNodeType(target, options));
  }
}

export default EdgeDefinition;
