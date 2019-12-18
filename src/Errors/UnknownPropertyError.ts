class UnknownPropertyError extends Error {
  constructor(className, key) {
    super(`Unknown property ${key} on ${className.toString()}`);
  }
}

export default UnknownPropertyError;
