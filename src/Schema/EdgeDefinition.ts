import DocumentDefinition from './DocumentDefinition';
import EdgeNodeType from './Fields/EdgeNodeType';
import Field from './Field';
import Schema from './Schema';
import InvalidSchemaDefinitionError from '../Errors/InvalidSchemaDefinitionError';
import AbstractType from './Fields/AbstractType';

class EdgeDefinition extends DocumentDefinition {
  private $from: Field<AbstractType> = null;

  private $to: Field<AbstractType> = null;

  isCorrectlyDefined(schema: Schema) {
    super.isCorrectlyDefined(schema);
    if (this.$from === null) throw new InvalidSchemaDefinitionError(this.constructor, 'No from property found');
    if (this.$to === null) throw new InvalidSchemaDefinitionError(this.constructor, 'No to property found');
  }

  get from() {
    return this.$from;
  }

  get to() {
    return this.$to;
  }

  setFrom(key: string, target: Function) {
    this.$from = new Field(key, new EdgeNodeType(target));
  }

  setTo(key: string, target: Function) {
    this.$to = new Field(key, new EdgeNodeType(target));
  }
}

export default EdgeDefinition;
