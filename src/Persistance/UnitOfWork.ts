/* eslint-disable dot-notation */
import 'reflect-metadata';

import Manager from '../Manager';
import ChangeSet, { Operation } from './ChangeSet';
import EdgeDefinition from '../Schema/EdgeDefinition';

enum State {
  CREATED = 'created',
  MANAGED = 'managed',
  DETACHED = 'detached',
  REMOVED = 'removed',
}

class UnitOfWork {

  /**
   * Once an object is retrieved from the database, its state is stored
   * in this map so that when it is updated, we can compute a correct
   * change set
   */
  private initialState: Map<object, object> = new Map();

  /**
   * How items are marked in this transaction
   */
  private identityMap: Map<object, State> = new Map();

  constructor(private manager: Manager) {
  }

  async syncChangeSet() {
    const toInsert = [];
    const toUpdate = [];
    const toDelete = [];
    this.computeChangeSet().forEach((changeSet) => {
      switch (changeSet.operation) {
        case Operation.INSERT:
          toInsert.push(changeSet);
          break;
        case Operation.UPDATE:
          toUpdate.push(changeSet);
          break;
        default:
          toDelete.push(changeSet);
          break;
      }
    });
    return this.applyInsert(toInsert);
  }

  async applyInsert(insertChanges: ChangeSet[]) {
    // Perform batch operation to insert all data in correct collections
    const collWorks: Map<Function, ChangeSet[]> = new Map();
    insertChanges.forEach((changeSet) => {
      const className = changeSet.item.constructor;
      if (!collWorks.has(className)) {
        collWorks.set(className, []);
      }
      collWorks.get(className).push(changeSet);
    });
    const insertPromises: Array<Promise<{ changes: ChangeSet[], response: object[] }>> = [];
    collWorks.forEach((currentChanges, className) => {
      const collection = this.manager.getWrappedCollection(className);
      insertPromises.push(new Promise((resolve) => {
        collection.save(currentChanges.map((it) => it.persistedData)).then((response) => {
          resolve({ changes: currentChanges, response });
        });
      }));
    });
    const insertResult = await Promise.all(insertPromises);
    insertResult.forEach((collectionResult) => {
      const { changes, response } = collectionResult;
      changes.forEach((change: ChangeSet, i) => {
        const { item } = change;
        const itemResponse = response[i];
        const definition = this.manager.schema.getDefinition(item.constructor);
        if (definition.idField) Reflect.set(item, definition.idField.key, itemResponse['_id']);
        if (definition.revField) Reflect.set(item, definition.revField.key, itemResponse['_rev']);
        if (definition.keyField) Reflect.set(item, definition.keyField.key, itemResponse['_key']);
      });
    });
  }

  computeChangeSet(): ChangeSet[] {
    const changeSet = [];
    this.identityMap.forEach((state, item) => {
      const definition = this.manager.schema.getDefinition(item.constructor);
      definition.validate(item);
      let operation;
      let previousState = {};
      if (state === State.CREATED) {
        operation = Operation.INSERT;
      } else if (state === State.REMOVED) {
        operation = Operation.DELETE;
      } else {
        operation = Operation.UPDATE;
        previousState = this.initialState.get(item);
      }
      const plainItem = { ...item };
      const persistedData = {};
      // Feed column data
      definition.fields.forEach((field, key) => {
        if (previousState[key] !== plainItem[key]) {
          persistedData[key] = plainItem[key];
        }
      });
      // Feed key and id if necessary
      if (operation !== Operation.INSERT) {
        if (definition.idField) persistedData['_id'] = plainItem[definition.idField.key];
        if (definition.keyField) persistedData['_key'] = plainItem[definition.keyField.key];
      }
      // If its an edge
      if (definition instanceof EdgeDefinition) {
        throw new Error('Not implemented yet');
        // persistedData['_from'] = plainItem[definition.from.key];
        // persistedData['_to'] = plainItem[definition.to.key];
      }
      changeSet.push(new ChangeSet(item, operation, persistedData));
    });
    return changeSet;
  }

  scheduleForInsert(item: object) {
    this.identityMap.set(item, State.CREATED);
  }

  scheduleForUpdate(item: object) {
    this.identityMap.set(item, State.MANAGED);
  }

  scheduleForDelete(item: object) {
    this.identityMap.set(item, State.REMOVED);
  }

  scheduleForDetach(item: object) {
    this.identityMap.set(item, State.DETACHED);
  }
}

export default UnitOfWork;
