import { AqlLiteral, AqlQuery } from 'arangojs/lib/cjs/aql-query';

import Database from '../Wrapper/Database';
import NativeQueryResult from './NativeQueryResult';

class NativeQueryRunner {
  constructor(private connection: Database) {
  }

  async runNativeQuery(nativeQuery: string | AqlLiteral | AqlQuery, params: object = null): Promise<NativeQueryResult> {
    const result = await this.connection.query(nativeQuery, params);
    return new NativeQueryResult(result);
  }
}

export default NativeQueryRunner;
