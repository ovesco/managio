import BaseCollection from '../Wrapper/BaseCollection';

abstract class DocumentRepository<T> {

  private collection: BaseCollection;

  constructor(collection: BaseCollection) {
    this.collection = collection;
  }

  async find(id: string): Promise<T> {
    return null;
  }

  async findBy(params: object): Promise<T[]> {
    return null;
  }

  async findAll(): Promise<T[]> {
    return null;
  }

  async findOneBy(params: object): Promise<T> {
    return null;
  }
}

export default DocumentRepository;
