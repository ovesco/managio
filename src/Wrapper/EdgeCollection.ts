import { EdgeCollection as ArangoEdgeCollection } from 'arangojs/lib/cjs/collection';
import BaseCollection from './BaseCollection';

class EdgeCollection extends BaseCollection {
  constructor(collection: ArangoEdgeCollection) {
    super(collection);
  }
}

export default EdgeCollection;