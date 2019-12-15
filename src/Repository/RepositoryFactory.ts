import Manager from '../Manager';
import DocumentRepository from './DocumentRepository';

// eslint-disable-next-line
export const createInstance = <T extends DocumentRepository>(C: {new(manager: Manager): T}, manager): T => new C(manager);

export const buildRepositories = (manager: Manager): Map<Function, DocumentRepository> => {
  const repositories: Map<Function, DocumentRepository> = new Map();
  manager.schema.documents.forEach((docDef) => {
    const instance = createInstance(docDef.options.repositoryClass, manager);
    repositories.set(docDef.constructor, instance);
  });
  manager.schema.edges.forEach((edgeDef) => {
    const instance = createInstance(edgeDef.options.repositoryClass, manager);
    repositories.set(edgeDef.constructor, instance);
  });
  return repositories;
};
