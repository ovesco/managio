import DocumentRepository from './Repository/DocumentRepository';
import Database from './Wrapper/Database';
import Schema from './Schema/Schema';

class Manager {
  constructor(public readonly schema: Schema, public readonly connection: Database) {
  }

  persist<T>(item: T): T {
    return item;
  }

  async flush() {

  }

  remove(item: object): Promise<boolean> {
    return null;
  }

  getRepository<T>(): DocumentRepository<T> {
    return null;
  }
}

export default Manager;
