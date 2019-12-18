class UnknownPropertyError extends Error {
  constructor(className, key) {
    super(`Unknown property ${key} on object of class ${className.name}`);
  }
}

export default UnknownPropertyError;
