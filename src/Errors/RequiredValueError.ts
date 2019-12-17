class RequiredValueError extends Error {
  constructor(constructor, key) {
    super(`No value found on ${constructor.name} for key ${key}`);
  }
}

export default RequiredValueError;
