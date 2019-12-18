class UnmanagedError extends Error {
  constructor(item: object) {
    super(`This element was found to be unmanaged even though it's supposed to be updated: ${item.toString()}`);
  }
}

export default UnmanagedError;
