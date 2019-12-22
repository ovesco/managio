/* eslint-disable no-shadow */
import 'reflect-metadata';
import * as deepmerge from 'deepmerge';

import GlobalRegistrer from '../Schema/GlobalRegistrer';
import Schema from '../Schema/Schema';
import { DocumentOptions } from '../Schema/DocumentDefinition';
import DocumentRepository from '../Repository/DocumentRepository';
import EdgeRepository from '../Repository/EdgeRepository';
import { getNativeType } from '../Schema/TypeMatcher';
import { ClassType } from '../Types';
import EdgeDefinition, { EdgeOptions } from '../Schema/EdgeDefinition';
import { EdgeNodeConfig } from '../Schema/Fields/EdgeNodeType';
import Manager from '../Manager';

// eslint-disable-next-line
export const document = (options: string | DocumentOptions) => {

  const collName = typeof options === 'string' ? options : options.collectionName;
  return <T extends ClassType>(constructor: T) => {
    const baseDocumentOptions: DocumentOptions = {
      collectionName: collName,
      repositoryClass: DocumentRepository,
    };

    const givenOptions = typeof options === 'string'
      ? baseDocumentOptions
      : deepmerge(baseDocumentOptions, options);

    GlobalRegistrer.getInstance().addModelTask(constructor, (schema: Schema) => {
      schema.registerDocument(constructor, collName, givenOptions);
    });
  };
};

export const edge = (options: string | EdgeOptions) => {
  const collName = typeof options === 'string' ? options : options.collectionName;
  const baseEdgeOptions: EdgeOptions = {
    collectionName: collName,
    repositoryClass: EdgeRepository,
    cascadeFrom: ['persist', 'attach'],
    cascadeTo: ['persist', 'attach'],
    selfDiscoverable: true,
  };

  const givenOptions = typeof options === 'string'
    ? baseEdgeOptions
    : deepmerge(baseEdgeOptions, options);
  return <T extends ClassType>(constructor: T) => {
    GlobalRegistrer.getInstance().addModelTask(constructor, (schema: Schema) => {
      schema.registerEdge(constructor, collName, givenOptions);
    });
  };
};

export const column = (required: boolean = true) => {
  return (target: any, key: string) => {
    const { constructor } = target;
    GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
      schema.getDefinition(constructor).addField(key, target, {
        required,
      });
    });
  };
};

export const key = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addKeyField(key, target);
  });
};

export const id = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addIdField(key, target);
  });
};

export const rev = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addrevField(key, target);
  });
};

const defineNodeEdgeProperty = (key: string, sym: any, target: any, manager: Manager) => {
  const definition = manager.schema.getEdgeDefinition(target.constructor);
  Object.defineProperty(target, key, {
    enumerable: true,
    set(value) {
      this[sym] = value;
      if (this[definition.from.key] instanceof definition.from.type.target
        && this[definition.to.key] instanceof definition.to.type.target) {
        if ((definition as EdgeDefinition).options.selfDiscoverable === true) {
          manager.persist(this);
        }
      }
    },
    get() {
      return this[sym];
    },
  });
};

export const from = (edgeNodeConfig: EdgeNodeConfig = {}) => {
  const options = edgeNodeConfig;
  return (target: any, key: string) => {
    // eslint-disable-next-line
    const sym = Symbol(key);
    const { constructor } = target;
    const fromTarget = getNativeType(key, target);
    GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
      schema.getEdgeDefinition(constructor).setFrom(key, fromTarget, options);
      schema.getDocumentDefinition(fromTarget).fromInEdges.push(schema.getDefinition(constructor) as EdgeDefinition);
    });
    GlobalRegistrer.getInstance().addPostProcessingTask(constructor, (manager) => {
      defineNodeEdgeProperty(key, sym, target, manager);
    });
  };
};

export const to = (edgeNodeConfig: EdgeNodeConfig = {}) => {
  const options = edgeNodeConfig;
  return (target: any, key: string) => {
    // eslint-disable-next-line
    const sym = Symbol(key);
    const { constructor } = target;
    const toTarget = getNativeType(key, target);
    GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
      schema.getEdgeDefinition(constructor).setTo(key, toTarget, options);
      schema.getDocumentDefinition(toTarget).toInEdges.push(schema.getDefinition(constructor) as EdgeDefinition);
    });
    GlobalRegistrer.getInstance().addPostProcessingTask(constructor, (manager) => {
      defineNodeEdgeProperty(key, sym, target, manager);
    });
  };
};
