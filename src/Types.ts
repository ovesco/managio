import Manager from './Manager';

export type RepositoryType = {
  new(manager: Manager, documentClass: Function)
};

export declare type ClassType = {
  new (...args: any[]);
};

export declare type CascadeType = Array<keyof { persist: 'persist', remove: 'remove', attach: 'attach', detach: 'detach'}>;
