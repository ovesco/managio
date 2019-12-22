/* eslint-disable dot-notation */
import Manager from '../Manager';
import ChangeSet, { Operation } from './ChangeSet';
import EdgeDefinition from '../Schema/EdgeDefinition';
import DeleteQuery from '../Query/DeleteQuery';
import UnmanagedError from '../Errors/UnmanagedError';
import ChangeSetBuilder from './ChangeSetBuilder';


export enum State {
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

  generateNextUnitOfWork() {
    const uow = new UnitOfWork(this.manager);
    this.identityMap.clear();
    this.initialState.clear();
    return uow;
  }

  async syncChangeSet() {
    const builder = new ChangeSetBuilder(this.manager.schema, this.identityMap);
    return;
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
    await this.applyInsert(toInsert);
    await this.applyDelete(toDelete);
    await this.applyUpdate(toUpdate);
  }

  async applyUpdate(updateChanges: ChangeSet[]) {
    const collWorks = UnitOfWork.groupByClassName(updateChanges);
    const updatePromises: Array<Promise<ChangeSet[]>> = [];
    collWorks.forEach((currentChanges, className) => {
      const collection = this.manager.getWrappedCollection(className);
      updatePromises.push(new Promise((resolve) => {
        // First import changes
        const changedData = currentChanges.map((it) => it.changedData);
        collection.bulkUpdate(changedData).then((updateResult) => {
          updateResult.forEach((arangoData, i) => {
            const change = currentChanges[i];
            this.manager.retriever.reflectApplyArangoFields(arangoData, change.item);
          });
          resolve(updateResult);
        });
      }));
    });
    await Promise.all(updatePromises);
  }

  async applyInsert(insertChanges: ChangeSet[]) {
    // Perform batch operation to insert all data in correct collections
    const collWorks = UnitOfWork.groupByClassName(insertChanges);
    const insertPromises: Array<Promise<{ changes: ChangeSet[], response: object[] }>> = [];
    collWorks.forEach((currentChanges, className) => {
      const collection = this.manager.getWrappedCollection(className);
      insertPromises.push(new Promise((resolve) => {
        collection.save(currentChanges.map((it) => it.changedData)).then((response) => {
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
        this.manager.retriever.reflectApplyArangoFields(itemResponse, item);
      });
    });
  }

  async applyDelete(deleteChanges: ChangeSet[]) {
    const colLWorks = UnitOfWork.groupByClassName(deleteChanges);
    const deletePromises: Array<Promise<ChangeSet[]>> = [];
    colLWorks.forEach((changes, className) => {
      const { keyField } = this.manager.schema.getDefinition(className);
      deletePromises.push(new Promise((resolve) => {
        const keys = changes.map((it) => it.item[keyField.key]);
        const deleteQuery = new DeleteQuery(this.manager, className, keys);
        deleteQuery.run().then(() => {
          // Remove all arango fields from deleted items
          changes.forEach((changeSet) => {
            this.manager.retriever.reflectRemoveArangoFields(changeSet.item);
          });
          resolve(changes);
        });
      }));
    });
    await Promise.all(deletePromises);
  }

  computeChangeSet(): ChangeSet[] {
    const changeSet = [];
    this.identityMap.forEach((state, item) => {
      const definition = this.manager.schema.getDefinition(item.constructor);
      definition.validate(item);
      let operation;
      let previousState = {};
      if (state === State.DETACHED) {
        return; // Entity is detached and as such shouldn't be part of this job
      }
      if (state === State.CREATED) {
        operation = Operation.INSERT;
      } else if (state === State.REMOVED) {
        operation = Operation.DELETE;
      } else {
        operation = Operation.UPDATE;
        if (!this.initialState.has(item)) {
          throw new UnmanagedError(item);
        }
        previousState = this.initialState.get(item);
      }
      const plainItem = { ...item };
      const persistedData = {};
      // Feed column data
      definition.fields.forEach((field, key) => {
        if (previousState[key] !== plainItem[key]) {
          persistedData[key] = field.type.toArangoData(plainItem[key]);
        }
      });
      // Feed key and id if necessary
      if (operation !== Operation.INSERT) {
        persistedData['_key'] = plainItem[definition.keyField.key];
        if (definition.idField) persistedData['_id'] = plainItem[definition.idField.key];
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

  putInitialState(item: object, initialState: object) {
    if (!this.initialState.has(item)) this.initialState.set(item, initialState);
  }

  private static groupByClassName(changes: ChangeSet[]): Map<Function, ChangeSet[]> {
    const collWorks: Map<Function, ChangeSet[]> = new Map();
    changes.forEach((changeSet) => {
      const className = changeSet.item.constructor;
      if (!collWorks.has(className)) {
        collWorks.set(className, []);
      }
      collWorks.get(className).push(changeSet);
    });
    return collWorks;
  }
}

export default UnitOfWork;
