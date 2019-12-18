import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

import { ClassType } from '../Types';
import Manager from '../Manager';

class DataRetriever {
  constructor(private manager: Manager) {
  }

  retrieveItem(className: ClassType, rawData: object) {
    const itemData = {};
    const definition = this.manager.schema.getDefinition(className);
    definition.fields.forEach((field) => {
      itemData[field.key] = field.type.fromArangoData(rawData[field.key]);
    });
    // Insert key, id and rev
    itemData[definition.keyField.key] = rawData['_key'];
    if (definition.idField) itemData[definition.idField.key] = rawData['_id'];
    if (definition.revField) itemData[definition.revField.key] = rawData['_rev'];
    const item = plainToClass(className, itemData);
    return this.manager.persist(item);
  }

  reflectApplyArangoFields(arangoData: object, item: object) {
    const definition = this.manager.schema.getDefinition(item.constructor);
    Reflect.set(item, definition.keyField.key, arangoData['_key']);
    if (definition.idField) Reflect.set(item, definition.idField.key, arangoData['_id']);
    if (definition.revField) Reflect.set(item, definition.revField.key, arangoData['_rev']);
  }
}

export default DataRetriever;
