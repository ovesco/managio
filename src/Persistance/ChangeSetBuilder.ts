import 'reflect-metadata';

import Schema from '../Schema/Schema';
import { State } from './UnitOfWork';
import EdgeDefinition, { EdgeOptions } from '../Schema/EdgeDefinition';
import { cascadeOptions } from '../Types';

class ChangeSetBuilder {
  private discoveredEntities: Map<object, State> = new Map();

  constructor(private schema: Schema, private identityMap: Map<object, State>) {
    identityMap.forEach((state, item) => {
      this.discoverRelatedEntities(item, state);
    });
  }

  discoverRelatedEntities(item: object, state: State) {
    const definition = this.schema.getDefinition(item.constructor);
    if (this.discoveredEntities.has(item)) {
      const currentState = this.discoveredEntities.get(item);
      if (state === State.REMOVED && currentState === State.MANAGED) {
        this.discoveredEntities.set(item, State.REMOVED); // If marked for remove through cascading overrides managing
      } else if (state === State.DETACHED) {
        this.discoveredEntities.set(item, State.DETACHED); // Detached overrides everything
      }
    }
    if (definition instanceof EdgeDefinition) {
      // We're on an edge, check related nodes
      const fromItem = Reflect.get(item, definition.from.key);
      const toItem = Reflect.get(item, definition.to.key);

      // Check cascading
      const { cascadeFrom } = definition.options as EdgeOptions;
      const { cascadeTo } = definition.options as EdgeOptions;
      switch (state) {
        case State.CREATED:
          if (cascadeFrom.includes(cascadeOptions.PERSIST) || cascadeFrom.includes(cascadeOptions.ATTACH)) {

          }
      }

    } else {
      // We're on a node, check if it has any edges
    }
  }
}

export default ChangeSetBuilder;
