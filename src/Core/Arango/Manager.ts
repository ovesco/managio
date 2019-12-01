import DocumentRepository from './Repository/DocumentRepository';
import Document from './Model/Document';

class Manager {
  persist(item: Document): Promise<Document> {
    return null;
  }

  remove(item: Document): Promise<Document> {
    return null;
  }

  getRepository<T extends Document>(): DocumentRepository<T> {
    return null;
  }
}

export default Manager;
