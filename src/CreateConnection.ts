import { Config } from 'arangojs/lib/cjs/connection';

import Manager from './Manager';
import Database from './Wrapper/Database';
import { loadSchema, updateArangoSchema } from './Schema/SchemaBuilder';

export interface ConnectionParameters {
  arangoConfig?: Config,
  models: Function[],
  database: string,
  syncSchema?: boolean,
  auth?: {
    type: 'bearer' | 'basic',
    token?: string,
    username?: string,
    password?: string,
  },
}

export const createConnection = async (params: ConnectionParameters) => {
  const database = new Database(params.arangoConfig);
  const schema = loadSchema(params);

  if (params.auth) {
    if (params.auth.type === 'basic') database.useBasicAuth(params.auth.username, params.auth.password);
    else database.useBearerAuth(params.auth.token);
  }

  const manager = new Manager(schema, database);
  if (params.syncSchema === true) await updateArangoSchema(manager, params);
  return manager;
};
