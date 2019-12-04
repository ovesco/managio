import 'reflect-metadata';

import SimpleNumber from './Fields/SimpleNumber';
import SimpleString from './Fields/SimpleString';
import SimpleBoolean from './Fields/SimpleBoolean';
import AbstractType from './Fields/AbstractType';

export const matchType = (type: Function) => {

  if (type === Number) return new SimpleNumber();
  if (type === String) return new SimpleString();
  if (type === Boolean) return new SimpleBoolean();

  throw new Error('Unknown type given for: ' + type.name);
};

export const getType = (key: string, target: any) : AbstractType => {
  const reflection = Reflect.getMetadata('design:type', target, key);
  return matchType(reflection);
};