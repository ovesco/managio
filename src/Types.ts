import Manager from './Manager';

export type RepositoryType = {
  new(manager: Manager, documentClass: Function)
};

export declare type ClassType = {
  new (...args: any[]);
};

export declare enum cascadeOptions {
  PERSIST = 'persist',
  ATTACH = 'attach',
  DETACH = 'detach',
  REMOVE = 'remove',
}

export declare type CascadeType = Array<keyof { persist: 'persist', remove: 'remove', attach: 'attach', detach: 'detach'}>;
