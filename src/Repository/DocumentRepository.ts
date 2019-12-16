import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';

import Manager from '../Manager';
import QueryRunner from '../Query/QueryRunner';

export interface IRepository {
  find<T>(id: string): Promise<T>;

  findBy<T>(params: object): Promise<T[]>;

  findAll<T>(): Promise<T[]>;

  findOneBy<T>(params: object): Promise<T>;
}

class DocumentRepository {

  constructor(private manager: Manager, private documentClass: Function) {
  }

  async find<T>(id: string): Promise<T> {
    return null;
  }

  async findBy<T>(params: object): Promise<T[]> {
    return null;
  }

  async findAll<T>(): Promise<T[]> {
    return null;
  }

  async findOneBy<T>(params: object): Promise<T> {
    return null;
  }

  createQuery(query: string | AqlLiteral, params: object = {}) : QueryRunner {
    return new QueryRunner(this.manager, this.documentClass, query);
  }
}

export default DocumentRepository;
