import Manager from '../Manager';
import DocumentRepository from './DocumentRepository';
import { RepositoryType } from '../Types';

// eslint-disable-next-line
export const createInstance = <T extends DocumentRepository>(x: Function, C: RepositoryType, manager): T => new C(manager, x);

export const buildRepositories = (manager: Manager): Map<Function, DocumentRepository> => {
  const repositories: Map<Function, DocumentRepository> = new Map();
  manager.schema.documents.forEach((docDef) => {
    const instance = createInstance(docDef.constructor, docDef.options.repositoryClass, manager);
    repositories.set(docDef.constructor, instance);
  });
  manager.schema.edges.forEach((edgeDef) => {
    const instance = createInstance(edgeDef.constructor, edgeDef.options.repositoryClass, manager);
    repositories.set(edgeDef.constructor, instance);
  });
  return repositories;
};
