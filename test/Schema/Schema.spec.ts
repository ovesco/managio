import 'reflect-metadata';
import { expect } from 'chai';
import 'mocha';

import {document, column, edge} from '../../src/Decorators/ClassDecorators';

@document('examples')
class Example {

  @column
  public numberval: number = 3;

  @column
  public stringval: string;

  @column
  public boolval: boolean = false;
}

@document('foo')
class Foo {

  @
  public bar: Bar;
}

@document('bars')
class Bar {

}

@edge('examplefoos')
class ExampleFoo {

}

describe('Object to document', () => {
  const e = new Example();
});