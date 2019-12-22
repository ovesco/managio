import GlobalRegistrer from './GlobalRegistrer';
import { ConnectionParameters } from '../CreateConnection';
import EdgeDefinition from './EdgeDefinition';
import Schema from './Schema';
import Manager from '../Manager';

export const loadSchema = (config: ConnectionParameters) => {
  const schema = new Schema();
  const registrar = GlobalRegistrer.getInstance();

  config.models.forEach((model) => {
    registrar.processModelTask(model, schema);
    registrar.processColumnTasks(model, schema);
  });

  return schema;
};

export const updateArangoSchema = async (manager: Manager, config: ConnectionParameters) => {
  const database = manager.connection;
  const { schema } = manager;
  const dbs = await database.listDatabases();
  if (!dbs.includes(config.database)) {
    await database.createDatabase(config.database);
  }
  database.useDatabase(config.database);

  const collections = await database.listCollections();
  const collCreations = config.models.map(async (model: Function) => {
    const definition = schema.getDefinition(model);
    const collection = definition instanceof EdgeDefinition
      ? database.edgeCollection(definition.collectionName)
      : database.collection(definition.collectionName);
    if (!collections.map((it) => it.name).includes(definition.collectionName)) {
      await collection.create();
    }
  });

  await Promise.all(collCreations);

};
