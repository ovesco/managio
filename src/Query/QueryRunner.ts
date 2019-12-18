import { AqlLiteral, AqlQuery } from 'arangojs/lib/cjs/aql-query';
import { BaseCollection } from 'arangojs/lib/cjs/collection';

import Manager from '../Manager';
import NativeQueryRunner from './NativeQueryRunner';
import { ClassType } from '../Types';
import QueryResult from './QueryResult';

class QueryRunner<T> extends NativeQueryRunner {
  constructor(private manager: Manager, private className: ClassType) {
    super(manager.connection);
  }

  async runQuery(nativeQuery: string | AqlLiteral | AqlQuery | ((a: BaseCollection) => AqlQuery), params: object = null) {
    const queryString = nativeQuery instanceof Function
      ? nativeQuery(this.manager.getWrappedCollection(this.className).getNativeCollection())
      : nativeQuery;
    const result = await super.runNativeQuery(queryString, params);
    return new QueryResult(this.className, this.manager, result);
  }
}

export default QueryRunner;
