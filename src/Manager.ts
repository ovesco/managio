import DocumentRepository from './Repository/DocumentRepository';
import Database from './Wrapper/Database';
import Schema from './Schema/Schema';

import Transaction from './Persistance/Transaction';
import { buildRepositories } from './Repository/RepositoryFactory';

class Manager {

  private workSet: Transaction;

  private repositories: Map<Function, DocumentRepository>;

  constructor(public readonly schema: Schema, public readonly connection: Database) {
    schema.validate();
    this.repositories = buildRepositories(this);
    this.workSet = new Transaction(this);
  }

  persist<T extends object>(item: T): T {
    this.schema.isPartOfSchema(item);
    const { key } = this.schema.getObjectDefinition(item).keyField;
    const keyValue = item[key];
    if (this.emptyValue(keyValue)) this.workSet.scheduleForInsert(item);
    else this.workSet.scheduleForUpdate(item);
    return item;
  }

  detach<T extends object>(item: T): T {
    this.schema.isPartOfSchema(item);
    this.workSet.scheduleForDetach(item);
    return item;
  }

  attach<T extends object>(item: T): T {
    return this.persist(item);
  }

  async flush() {
  }

  remove<T extends object>(item: T): T {
    this.workSet.scheduleForDelete(item);
    return item;
  }

  getRepository(className: Function): DocumentRepository {
    this.schema.isPartOfSchema(className);
    return this.repositories.get(className);
  }

  private emptyValue(value: any) {
    return value === null || value === undefined;
  }
}

export default Manager;
