export enum Operation {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}

class ChangeSet {
  constructor(public readonly item: object,
    public readonly operation: Operation,
    public readonly changedData: object) {
  }
}

export default ChangeSet;
