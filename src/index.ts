// eslint-disable-next-line
import 'reflect-metadata';

import {
  document,
  column,
  key,
} from './Decorators/ClassDecorators';
import { ConnectionParameters, createConnection } from './CreateConnection';
import DocumentRepository from './Repository/DocumentRepository';

class ExampleRepository extends DocumentRepository {
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

  @column()
  private foo: number;

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

const config = {
  database: 'mydb',
  models: [Example, Foo],
} as ConnectionParameters;

createConnection(config).then(async (manager) => {
  const e = new Example(10, 'yo', true);
  const f = new Example(20, 'yoyoyoyoyo', false);
  manager.persist(e);
  console.log(e);
  manager.persist(f);
  await manager.flush();
  console.log(e);
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
