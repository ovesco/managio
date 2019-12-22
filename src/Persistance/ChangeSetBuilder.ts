import 'reflect-metadata';

import Schema from '../Schema/Schema';
import { State } from './UnitOfWork';
import EdgeDefinition from '../Schema/EdgeDefinition';

enum cascadeOptions {
  PERSIST = 'persist',
  ATTACH = 'attach',
  DETACH = 'detach',
  REMOVE = 'remove',
}

class ChangeSetBuilder {
  private discoveredEntities: Map<object, State> = new Map();

  constructor(private schema: Schema, private identityMap: Map<object, State>) {
    identityMap.forEach((state, item) => {
      this.discoverRelatedEntities(item, state);
    });
  }

  get discoveredEntitiesMap() {
    return this.discoveredEntities;
  }

  private discoverRelatedEntities(item: object, state: State) {
    const definition = this.schema.getDefinition(item.constructor);
    if (this.discoveredEntities.has(item)) {
      const currentState = this.discoveredEntities.get(item);
      if (state === State.REMOVED && currentState === State.MANAGED) {
        this.discoveredEntities.set(item, State.REMOVED); // If marked for remove through cascading overrides managing
      }
    }
    if (state === State.DETACHED) {
      this.discoveredEntities.set(item, State.DETACHED); // Detached overrides everything
    }
    if (definition instanceof EdgeDefinition) {
      // We're on an edge, check related nodes
      const fromItem = Reflect.get(item, definition.from.key);
      const toItem = Reflect.get(item, definition.to.key);

      // Check edge cascading
      const { cascadeFrom } = definition.options;
      const { cascadeTo } = definition.options;
      this.checkCascade(fromItem, cascadeFrom, state);
      this.checkCascade(toItem, cascadeTo, state);
    }
    if (!this.discoveredEntities.has(item)) {
      this.discoveredEntities.set(item, state);
    }
  }

  checkCascade(item: object, cascade: Array<string>, state: State) {
    switch (state) {
      case State.CREATED:
      case State.MANAGED:
        if (cascade.includes(cascadeOptions.PERSIST) || cascade.includes(cascadeOptions.ATTACH)) {
          this.discoverRelatedEntities(item, state);
        }
        break;
      case State.DETACHED:
        if (cascade.includes(cascadeOptions.DETACH)) {
          this.discoverRelatedEntities(item, state);
        }
        break;
      case State.REMOVED:
        if (cascade.includes(cascadeOptions.REMOVE)) {
          this.discoverRelatedEntities(item, state);
        }
        break;
      default:
        throw new Error(`Unknown given state ${state}`);
    }
  }
}

export default ChangeSetBuilder;
