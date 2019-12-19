import 'reflect-metadata';

import Schema from '../Schema/Schema';
import UnitOfWork, { State } from './UnitOfWork';
import EdgeDefinition, { EdgeOptions } from '../Schema/EdgeDefinition';
import { cascadeOptions } from '../Types';
import DocumentDefinition from "../Schema/DocumentDefinition";

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

      // Check edge cascading
      const { cascadeFrom } = definition.options as EdgeOptions;
      const { cascadeTo } = definition.options as EdgeOptions;
      this.checkCascade(fromItem, cascadeFrom, state);
      this.checkCascade(toItem, cascadeTo, state);

    } else {
      // We're on a node, check if it has any edges
      const fromEdges = (definition as DocumentDefinition).$fromInEdges;
      const toEdges = (definition as DocumentDefinition).$toInEdges;
      fromEdges.forEach((fromEdgeDef) => {
        const { cascadeFrom } = fromEdgeDef.options;
      });
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
