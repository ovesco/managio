import Schema from './Schema/Schema';

class WorkSet {

  private dirtyMap: Map<object, boolean> = new Map();

  private changeSet: Array<object> = [];

  constructor(private schema: Schema) {

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