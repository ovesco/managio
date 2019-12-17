export enum Operation {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

class ChangeSet {
  constructor(public readonly item: object,
    public readonly operation: Operation,
    public readonly persistedData: object) {
  }
}

export default ChangeSet;
