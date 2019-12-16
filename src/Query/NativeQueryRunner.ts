import { AqlLiteral } from 'arangojs/lib/cjs/aql-query';

import Database from '../Wrapper/Database';

class NativeQueryRunner {
  constructor(private connection: Database, private query: string | AqlLiteral,
    private params: object = {}) {
  }

  async getRawResults() {
    return this.connection.query(this.query, this.params);
  }
}

export default NativeQueryRunner;
