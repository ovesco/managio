import Manager from '../Manager';

export interface IRepository {
  find<T>(id: string): Promise<T>;

  findBy<T>(params: object): Promise<T[]>;

  findAll<T>(): Promise<T[]>;

  findOneBy<T>(params: object): Promise<T>;
}

class DocumentRepository {

  constructor(private manager: Manager) {
  }

  async find<T>(id: string): Promise<T> {
    return null;
  }

  async findBy<T>(params: object): Promise<T[]> {
    return null;
  }

  async findAll<T>(): Promise<T[]> {
    return null;
  }

  async findOneBy<T>(params: object): Promise<T> {
    return null;
  }
}

export default DocumentRepository;
