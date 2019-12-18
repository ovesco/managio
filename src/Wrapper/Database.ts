import { Database as DB } from 'arangojs';
import { Config } from 'arangojs/lib/cjs/connection';
import {AqlLiteral, AqlQuery, GeneratedAqlQuery} from 'arangojs/lib/cjs/aql-query';
import { CreateDatabaseUser } from 'arangojs/lib/cjs/database';
import { EdgeCollection as ArangoEdgeCollection, DocumentCollection as ArangoDocumentCollection } from 'arangojs/lib/cjs/collection';

import DocumentCollection from './DocumentCollection';
import EdgeCollection from './EdgeCollection';

class Database {

  private db: DB;

  constructor(config?: Config) {
    this.db = new DB(config);
  }

  async acquireHostList() {
    return this.db.acquireHostList();
  }

  useDatabase(database: string) {
    this.db.useDatabase(database);
  }

  useBasicAuth(username: string, password: string) {
    this.db.useBasicAuth(username, password);
  }

  useBearerAuth(token: string) {
    this.db.useBearerAuth(token);
  }

  async login(username: string, password: string) {
    return this.db.login(username, password);
  }

  async version() {
    return this.db.version();
  }

  close() {
    this.db.close();
  }

  async createDatabase(dbname: string, users: Array<CreateDatabaseUser> = null) {
    return this.db.createDatabase(dbname, users);
  }

  async exists() {
    return this.db.exists();
  }

  async get() {
    return this.db.get();
  }

  async listDatabases() {
    return this.db.listDatabases();
  }

  async listUserDatabases() {
    return this.db.listUserDatabases();
  }

  async dropDatabase(dbname: string) {
    return this.db.dropDatabase(dbname);
  }

  async truncate() {
    return this.db.truncate();
  }

  collection(collectionName: string): DocumentCollection {
    const nativeCollection = this.db.collection(collectionName);
    const collection = new DocumentCollection(nativeCollection);
    return collection;
  }

  edgeCollection(collectionName: string): EdgeCollection {
    const nativeCollection = this.db.edgeCollection(collectionName);
    const collection = new EdgeCollection(nativeCollection);
    return collection;
  }

  async listCollections(excluseSystem: boolean = true) {
    return this.db.listCollections(excluseSystem);
  }

  async collections(excludeSystem: boolean = true) {
    const collections = await this.db.collections(excludeSystem);
    return collections.map((collection) => {
      if (collection instanceof ArangoEdgeCollection) {
        return new EdgeCollection(collection);
      }
      if (collection instanceof ArangoDocumentCollection) {
        return new DocumentCollection(collection);
      }
      // Todo check system collections
      return null;
    }).filter((it) => it !== null);
  }

  async query(query: string | AqlQuery | AqlLiteral, params: object = null) {
    if (params === null) return this.db.query(query);
    return this.db.query(query as string, params);
  }
}

export default Database;
