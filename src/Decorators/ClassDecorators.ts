import 'reflect-metadata';
import GlobalRegistrer from '../Schema/GlobalRegistrer';
import Schema from '../Schema/Schema';

import OneToOneRelation from "../Schema/Fields/OneToOneRelation";
import OneToManyRelation from "../Schema/Fields/OneToManyRelation";
import ManyToOneRelation from "../Schema/Fields/ManyToOneRelation";
import ManyToManyRelation from "../Schema/Fields/ManyToManyRelation";

type Class =  { new(...args: any[]): {} };

export const document = (collectionName: string) => {
  return <T extends Class>(constructor: T): T => {
    function construct(constructor, args) {
      const c: any = function () {
        return constructor.apply(this, args);
      };
      c.prototype = constructor.prototype;
      return new c();
    }

    const generator = (...args) => {
      const newConstructor = construct(constructor, args);
      return new Proxy(newConstructor, {
        set(target, name, value, receiver) {
          console.log(target, name, value);
          return Reflect.set(target, name, value, receiver);
        }
      });
    };

    generator.prototype = constructor.prototype;

    GlobalRegistrer.getInstance().addModelTask(generator, (schema: Schema) => {
      schema.registerDocument(generator, collectionName, constructor.name);
    });
    return generator as unknown as T;
  };
};

export const edge = (collectionName: string, from: Function, to: Function) => {
  return  <T extends Class>(constructor: T) => {
    GlobalRegistrer.getInstance().addModelTask(constructor, (schema: Schema) => {
      schema.registerEdge(constructor, collectionName, from, to);
    });
  };
};

export const column = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addField(key, target);
  });
};

export const OneToOne = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addRelation(key, new OneToOneRelation());
  });
};

export const OneToMany = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addRelation(key, new OneToManyRelation());
  });
};

export const ManyToOne = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addRelation(key, new ManyToOneRelation());
  });
};

export const ManyToMany = (target: any, key: string) => {
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    schema.getDefinition(constructor).addRelation(key, new ManyToManyRelation());
  });
};

export const from = (target: any, key: string) => {
  console.log(target, key);
  const { constructor } = target;
  GlobalRegistrer.getInstance().addColumnTask(constructor, (schema: Schema) => {
    // do stuff
  });
};