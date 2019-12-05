import Schema from './Schema/Schema';
import Manager from './Manager';

class WorkSet {

  private changeSet: Array<object> = [];

  constructor(private manager: Manager, private schema: Schema) {

  }

  watch(item: object) {
    const definition = this.schema.getDefinition(item.constructor);
    this.changeSet.push({ item, definition });
    this.dirtyMap.set(item, false);
  }

  isDirty(item: object) {
    this.dirtyMap.has(item) ? this.dirtyMap.get(item) : false;
  }
}

export default WorkSet;