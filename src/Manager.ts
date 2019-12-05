import DocumentRepository from './Repository/DocumentRepository';
import Database from './Wrapper/Database';
import Schema from './Schema/Schema';

class Manager {

  private dirtyMap: Map<object, boolean> = new Map();

  private watchingSet: Array<object> = [];

  constructor(public readonly schema: Schema, public readonly connection: Database) {
    Managers.registerManager(this);
  }

  persist<T extends object>(item: T): T {
    this.attach(item);
    this.markDirty(item);
    return item;
  }

  detach<T extends object>(item: T): T {
    const index = this.watchingSet.indexOf(item);
    if (index > -1) this.watchingSet.splice(index, 1);
    return item;
  }

  attach<T extends object>(item: T): T {
    if (!this.watchingSet.includes(item)) this.watchingSet.push(item);
    return item;
  }

  markDirty<T extends object>(item: T) {
    this.dirtyMap.set(item, true);
  }

  async flush() {
    
  }

  remove(item: object): Promise<boolean> {
    return null;
  }

  getRepository<T>(): DocumentRepository<T> {
    return null;
  }
}

export default Manager;

export class Managers {
  static managers: Manager[] = [];

  static registerManager(manager: Manager) {
    Managers.managers.push(manager);
  }

  static getManagerFor(className: Function) {
    for (const manager of Managers.managers) {
      if (manager.schema.hasDefinition(className)) {
        return manager;
      }
    }
    return null;
  }
}
