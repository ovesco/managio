// eslint-disable-next-line
import 'reflect-metadata';

import {
  document,
  column,
  edge,
  key, rev, from, to,
} from './Decorators/ClassDecorators';
import { ConnectionParameters, createConnection } from './CreateConnection';
import DocumentRepository from './Repository/DocumentRepository';

class ExampleRepository extends DocumentRepository<Example> {
  getSwag() {
    return 'swag';
  }
}

class Boom {
  constructor(private yo: string) {}
}

@document({
  collectionName: 'examples',
  repositoryClass: ExampleRepository,
})
class Example {

  constructor(foo: number, bar, baz, boom) {
    this.foo = foo;
    this.bar = bar;
    this.baz = baz;
    this.boom = boom;
  }

  @rev
  private revision: string;

  @key
  private key: number;

  @column()
  private foo: number;

  @column()
  private boom: Boom;

  @column()
  private bar: string;

  @column()
  private baz: boolean;

  setFoo(foo) {
    this.foo = foo;
  }

  getKey() {
    return this.key;
  }
}

@document('foos')
class Foo {

  @key
  private key: number;

  @column()
  private swag: string;
}

@edge('fooExamples')
class FooExample {

  @key
  private key: number;

  @from
  private from: Foo;

  @to
  private to: Example;
}

const config = {
  database: 'mydb',
  models: [Example, Foo, FooExample],
} as ConnectionParameters;

createConnection(config).then(async (manager) => {
  const foo = new Example(123, 'yoyo', true, new Boom('BOOOOOM'));
  // manager.persist(foo);
  console.log(manager.schema.getDefinition(FooExample));
  const repo = manager.getRepository(Example);
  console.log(await repo.find('23958'));
});

/*
class Bar {
  constructor(public swag: string) {}
}

const bar = new Bar('yoyooy');
const proxy = new Proxy(bar, {
  set(target, prop, value) {
    console.log(target, prop, value);
    target[prop] = value;
    return true;
  }
});

console.log(proxy.constructor);
console.log(proxy.constructor === Bar);
 */
