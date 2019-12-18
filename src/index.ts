// eslint-disable-next-line
import 'reflect-metadata';
import { aql } from 'arangojs';

import {
  document,
  column,
  key, rev,
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

  constructor(foo: number, bar, baz) {
    this.foo = foo;
    this.bar = bar;
    this.baz = baz;
  }

  @rev
  private revision: string;

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
  const repo = manager.getRepository(Example);
  const item = await repo.findBy({ baz: true });
  item.forEach((it) => it.setFoo(Math.round(Math.random() * 10000)));
  console.log(item.length);
  await manager.flush();
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
