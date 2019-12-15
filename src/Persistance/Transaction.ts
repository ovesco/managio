// eslint-disable-next-line
import Manager from '../Manager';
import ChangeSet from './ChangeSet';

enum State {
  CREATED = 'created',
  MANAGED = 'managed',
  DETACHED = 'detached',
  REMOVED = 'removed'
}

class Transaction {

  private changeSet: Map<Function, ChangeSet<object>> = new Map();

  private identityMap: Map<object, State> = new Map();

  constructor(private manager: Manager) {
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

export default Transaction;
