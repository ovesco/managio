import 'reflect-metadata';

import { document, column, edge } from './Decorators/ClassDecorators';
import { ConnectionParameters, createConnection } from "./CreateConnection";

@document("examples")
class Example {

  constructor(foo, bar, baz) {
    this.foo = foo;
    this.bar = bar;
    this.baz = baz;
  }

  @column
  private foo: number;

  @column
  private bar: string;

  @column
  private baz: boolean;
}

@document("foos")
class Foo {

  @column
  private swag: string;
}

@edge("fooexamples", Example, Foo)
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
  }
} as ConnectionParameters;

createConnection(config).then(async (manager) => {
  const e = new Example(10, 'yo', true);
  console.log(manager.schema);
  manager.persist(e);
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