import DocumentRepository from './Repository/DocumentRepository';
import Database from './Wrapper/Database';
import Schema from './Schema/Schema';

import UnitOfWork from './Persistance/UnitOfWork';
import { buildRepositories } from './Repository/RepositoryFactory';
import DocumentCollection from './Wrapper/DocumentCollection';
import EdgeCollection from './Wrapper/EdgeCollection';
import EdgeDefinition from './Schema/EdgeDefinition';
import { emptyValue } from './Helpers';

class Manager {

  private workSet: UnitOfWork;

  private repositories: Map<Function, DocumentRepository>;

  constructor(public readonly schema: Schema, public readonly connection: Database) {
    schema.validate();
    this.repositories = buildRepositories(this);
    this.workSet = new UnitOfWork(this);
  }

  persist<T extends object>(item: T): T {
    this.schema.isPartOfSchema(item);
    const { key } = this.schema.getDefinition(item.constructor).keyField;
    const keyValue = item[key];
    if (emptyValue(keyValue)) this.workSet.scheduleForInsert(item);
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
    return this.workSet.syncChangeSet();
  }

  remove<T extends object>(item: T): T {
    this.workSet.scheduleForDelete(item);
    return item;
  }

  getRepository(className: Function): DocumentRepository {
    this.schema.isPartOfSchema(className);
    return this.repositories.get(className);
  }

  getWrappedCollection(className: Function): DocumentCollection | EdgeCollection {
    const { collectionName } = this.schema.getDefinition(className);
    return this.schema.getDefinition(className) instanceof EdgeDefinition
      ? this.connection.edgeCollection(collectionName)
      : this.connection.collection(collectionName);
  }
}

export default Manager;
