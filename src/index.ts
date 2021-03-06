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

  constructor() {
    this.swag = `Foo swag level: ${Math.round(Math.random() * 10000)}`;
  }

  @key
  private key: number;

  @column()
  private swag: string;
}

@edge('fooExamples')
class FooExample {

  constructor(foo, example) {
    this.foo = foo;
    this.example = example;
  }

  @key
  private key: number;

  @from()
  public foo: Foo;

  @to()
  private example: Example;
}

const config = {
  database: 'mydb',
  syncSchema: false,
  arangoConfig: {
    url: 'http://192.168.99.100:8529',
  },
  models: [Example, Foo, FooExample],
} as ConnectionParameters;

createConnection(config).then(async (manager) => {
  for (let i = 0; i < 1; i += 1) {
    const example = new Example(3, 'yoyo', true, new Boom('BOOOOOM'));
    const foo = new Foo();
    const fooExample = new FooExample(foo, example);
    manager.persist(foo);
  }
  await manager.flush();
  // const repo = manager.getRepository(Example);
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
