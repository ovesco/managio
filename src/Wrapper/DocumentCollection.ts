import { DocumentCollection as ArangoDocumentCollection } from 'arangojs/lib/cjs/collection';
import BaseCollection from './BaseCollection';

class DocumentCollection extends BaseCollection {

  constructor(collection: ArangoDocumentCollection) {
    super(collection);
  }
}

export default DocumentCollection;