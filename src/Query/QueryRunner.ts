import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';

import Manager from '../Manager';
import NativeQueryRunner from './NativeQueryRunner';

class QueryRunner extends NativeQueryRunner {
  constructor(private manager: Manager, private from: Function,
    query: string | AqlLiteral, params = {}) {
    super(manager.connection, query, params);
  }

  async getResult() {
    const results = await super.getRawResults();
  }
}

export default QueryRunner;
