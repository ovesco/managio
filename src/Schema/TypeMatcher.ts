import 'reflect-metadata';

import NumberType from './Fields/NumberType';
import StringType from './Fields/StringType';
import BooleanType from './Fields/BooleanType';
import EmbeddedType from './Fields/EmbeddedType';
import {ClassType} from '../Types';

export const getNativeType = (key: string, target: any) => Reflect.getMetadata('design:type', target, key);

export const matchType = (type: ClassType, options) => {
  switch (type) {
    case Number: return new NumberType(options);
    case String: return new StringType(options);
    case Boolean: return new BooleanType(options);
    case Map:
    case Set:
    case Array:
      throw new Error('Cant embed maps, sets or array yet.');
    default:
      return new EmbeddedType(options, type);
  }
};

export const getType = (key: string, target: any, options: object) => matchType(getNativeType(key, target), options);
