// eslint-disable-next-line
import 'reflect-metadata';

import {
  document,
  column,
  edge,
  key,
} from './Decorators/ClassDecorators';
import { ConnectionParameters, createConnection } from './CreateConnection';
import DocumentRepository from './Repository/DocumentRepository';

class ExampleRepository extends DocumentRepository<Example> {
  getSwag() {
    return 'swag';
  }
}

@document({
  collectionName: 'examples',
  repositoryClass: ExampleRepository,
})
class Example {

  constructor(foo, bar, baz) {
    this.foo = foo;
    this.bar = bar;
    this.baz = baz;
  }

  @key
  private key: number;

  @column
  private foo: number;

  @column
  private bar: string;

  @column
  private baz: boolean;

  setFoo(foo) {
    this.foo = foo;
  }
}

@document('foos')
class Foo {

  @key
  private key: number;

  @column
  private swag: string;
}

@edge('fooexamples')
class FooExample {

  @column
  private yolo: number;
}

const config = {
  database: 'mydb',
  models: [Example, FooExample, Foo],
  auth: {
    type: 'basic',
    username: 'root',
    password: 'root',
  },
} as ConnectionParameters;

createConnection(config).then(async (manager) => {
  const e = new Example(10, 'yo', true);
  e.setFoo('yoyoyo');
  manager.persist(e);
  await manager.flush();

  const repository = manager.getRepository(Example) as ExampleRepository;
  console.log(repository.getSwag());
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

