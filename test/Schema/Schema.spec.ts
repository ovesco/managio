import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';

import { document, column } from '../../src/Decorators/ClassDecorators';

@document
class Example {

  @column
  private foo: number;

  private bar: string;
}

describe('Object to document', () => {
  const e = new Example();
});