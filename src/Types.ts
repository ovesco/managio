import Manager from './Manager';

export type RepositoryType = {
  new(manager: Manager, documentClass: Function)
};

export declare type ClassType = {
  new (...args: any[]);
};
