class InvalidTypeError extends Error {
  constructor(arangoKey: string, propName: string, target: object) {
    super(`Invalid attribute type for ${arangoKey} on property ${propName} of class ${target.constructor.name}`);
  }
}

export default InvalidTypeError;