import Document from '../Model/Document';

abstract class DocumentRepository<T extends Document> {

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
