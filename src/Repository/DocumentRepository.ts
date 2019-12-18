import { ArrayCursor } from 'arangojs/lib/cjs/cursor';

import Manager from '../Manager';
import QueryRunner from '../Query/QueryRunner';
import DocumentCollection from '../Wrapper/DocumentCollection';
import { ClassType } from '../Types';
import UnknownPropertyError from '../Errors/UnknownPropertyError';
import QueryResult from '../Query/QueryResult';
import NativeQueryResult from '../Query/NativeQueryResult';

export interface IRepository {
  find<T>(id: string): Promise<T>;

  findBy<T>(params: object): Promise<T[]>;

  findAll<T>(): Promise<T[]>;

  findOneBy<T>(params: object): Promise<T>;
}

class DocumentRepository<T> {

  private collection: DocumentCollection;

  constructor(private manager: Manager, private documentClass: ClassType) {
    this.collection = manager.getWrappedCollection(documentClass);
  }

  async find(idOrKey: string): Promise<T> {
    const result = await this.collection.document(idOrKey);
    return this.manager.retriever.retrieveItem(this.documentClass, result);
  }

  async findBy(params: object): Promise<T[]> {
    return this.createQueryResult(await this.collection.byExample(params)).all();
  }

  async findAll(): Promise<T[]> {
    const result = await this.collection.all();
    return result.map((it) => this.manager.retriever.retrieveItem(this.documentClass, it));
  }

  async findOneBy(params: object): Promise<T> {
    this.validateFields(params);
    try {
      const result = await this.collection.firstExample(params);
      return this.manager.retriever.retrieveItem(this.documentClass, result);
    } catch {
      return null;
    }
  }

  createQueryRunner() : QueryRunner<T> {
    return new QueryRunner<T>(this.manager, this.documentClass);
  }

  private createQueryResult(cursor: ArrayCursor): QueryResult<T> {
    return new QueryResult<T>(this.documentClass, this.manager, new NativeQueryResult(cursor));
  }

  private validateFields(params: object) {
    const definition = this.manager.schema.getDefinition(this.documentClass);
    Object.keys(params).forEach((property) => {
      if (!definition.fields.has(property)) {
        throw new UnknownPropertyError(this.documentClass, property);
      }
    });
  }
}

export default DocumentRepository;
