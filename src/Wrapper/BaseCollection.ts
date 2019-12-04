import { BaseCollection as ArangoBaseCollection } from 'arangojs/lib/cjs/collection';
import { CreateCollectionOptions } from 'arangojs/lib/cjs/util/types';

class BaseCollection {

  private collection: ArangoBaseCollection;

  constructor(collection: ArangoBaseCollection) {
    this.collection = collection;
  }

  async create(properties?: CreateCollectionOptions) {
    return this.collection.create(properties);
  }

  async load() {
    return this.collection.load();
  }

  async unload() {
    return this.collection.unload();
  }

  async setProperties(properties: CreateCollectionOptions) {
    return this.collection.setProperties(properties);
  }

  async rename(name: string) {
    return this.collection.rename(name);
  }

  async rotate() {
    return this.collection.rotate();
  }

  async truncate() {
    return this.collection.truncate();
  }

  async drop(properties) {
    return this.collection.drop(properties);
  }
}

export default BaseCollection;
