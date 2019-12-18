import { aql } from 'arangojs';

import NativeQueryRunner from './NativeQueryRunner';
import Manager from '../Manager';

class DeleteQuery extends NativeQueryRunner {
  constructor(private manager: Manager, private className: Function, private keys: string[]) {
    super(manager.connection);
  }

  async run() {
    const collection = this.manager.getWrappedCollection(this.className).getNativeCollection();
    const query = aql`FOR x IN ${collection} FILTER x._key IN ${this.keys} REMOVE x IN ${collection}`;
    return super.runNativeQuery(query);
  }
}

export default DeleteQuery;
