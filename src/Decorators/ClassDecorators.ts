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

export const edge = (options: string | DocumentOptions) => {

  const collName = typeof options === 'string' ? options : options.collectionName;
  const baseEdgeOptions: DocumentOptions = {
    collectionName: collName,
    repositoryClass: EdgeRepository,
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

export const from = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getEdgeDefinition(constructor).setFrom(key, getNativeType(key, target));
  });
};

export const to = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getEdgeDefinition(constructor).setTo(key, getNativeType(key, target));
  });
};
