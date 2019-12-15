class InvalidSchemaDefinitionError extends Error {
  constructor(constructor: Function, message: string) {
    super(`Invalid schema definition for ${constructor.name}: ${message}`);
  }
}

export default InvalidSchemaDefinitionError;