import { BaseCollection as ArangoBaseCollection, DocumentCollection } from 'arangojs/lib/cjs/collection';
import { CreateCollectionOptions } from 'arangojs/lib/cjs/util/types';

class BaseCollection {

  private collection: ArangoBaseCollection;

  constructor(collection: ArangoBaseCollection) {
    this.collection = collection;
  }

  getNativeCollection() {
    return this.collection;
  }

  name() {
    return this.collection.name;
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

  async save(data, opts = {}) {
    return (this.collection as DocumentCollection).save(data, opts);
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

  async document(key) {
    return this.collection.document(key);
  }

  async all(opts = {}) {
    return this.collection.all(opts);
  }

  async byExample(example: object) {
    return this.collection.byExample(example);
  }

  async firstExample(example: object) {
    return this.collection.firstExample(example);
  }

  async import(data, opts = {}) {
    return this.collection.import(data, opts);
  }
}

export default BaseCollection;
