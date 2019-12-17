import 'reflect-metadata';

import NumberType from './Fields/NumberType';
import StringType from './Fields/StringType';
import BooleanType from './Fields/BooleanType';

export const getNativeType = (key: string, target: any) => Reflect.getMetadata('design:type', target, key);

export const matchType = (type: Function, options) => {

  if (type === Number) return new NumberType(options);
  if (type === String) return new StringType(options);
  if (type === Boolean) return new BooleanType(options);
  throw new Error(`Unknown type given for: ${type.name}`);
};

export const getType = (key: string, target: any, options: object) => matchType(getNativeType(key, target), options);
