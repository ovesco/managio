import 'reflect-metadata';
import GlobalRegistrer from '../Schema/GlobalRegistrer';
import Schema from '../Schema/Schema';
import { Managers } from '../Manager';

type Class =  { new(...args: any[]): {} };

function construct(constructor, args) {
  const c: any = function () {
    return constructor.apply(this, args);
  };
  c.prototype = constructor.prototype;
  return new c();
}

const proxyGenerator = (constructor) => {
  return (...args) => {
    const newConstructor = construct(constructor, args);
    return new Proxy(newConstructor, {
      set(target, key: string, value, receiver) {
        const proxyClass = GlobalRegistrer.getInstance().legacyToProxy.get(constructor);
        const manager = Managers.getManagerFor(proxyClass);
        const fieldKeys = Array.from(manager.schema.getDefinition(proxyClass).fields.keys());
        if (fieldKeys.includes(key)) Managers.getManagerFor(proxyClass).markDirty(target);
        return Reflect.set(target, key, value, receiver);
      }
    });
  };
};

export const document = (collectionName: string) => {
  return <T extends Class>(constructor: T): T => {

    const generator = proxyGenerator(constructor);

    Object.defineProperty(generator, 'name', { value: `${constructor.name}Proxy` });
    generator.prototype = constructor.prototype;
    GlobalRegistrer.getInstance().addModelTask(generator, constructor, (schema: Schema) => {
      schema.registerDocument(generator, collectionName);
    });
    return generator as unknown as T;
  };
};

export const edge = (collectionName: string, from: Function, to: Function) => {
  return  <T extends Class>(constructor: T) => {

    const generator = proxyGenerator(constructor);

    Object.defineProperty(generator, 'name', { value: `${constructor.name}Proxy` });
    generator.prototype = constructor.prototype;
    GlobalRegistrer.getInstance().addModelTask(generator, constructor, (schema: Schema) => {
      schema.registerEdge(generator, collectionName, from, to);
    });
    return generator as unknown as T;
  };
};

export const column = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(GlobalRegistrer.getInstance().legacyToProxy.get(constructor)).addField(key, target);
  });
};

export const from = (target: any, key: string) => {
  console.log(target, key);
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    // do stuff
  });
};