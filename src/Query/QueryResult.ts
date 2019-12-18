import NativeQueryResult from './NativeQueryResult';
import Manager from '../Manager';
import { ClassType } from '../Types';

class QueryResult<T> {
  constructor(private className: ClassType, private manager: Manager, private nativeResult: NativeQueryResult) {
  }

  async all(): Promise<T[]> {
    return this.convertMultiple(await this.nativeResult.all());
  }

  async next(): Promise<T> {
    return this.convert(await this.nativeResult.next());
  }

  async nextBatch(): Promise<T[]> {
    return this.convertMultiple(await this.nativeResult.nextBatch());
  }

  private convertMultiple(data: object[]) {
    return data.map((it) => this.convert(it));
  }

  private convert(rawData) {
    return this.manager.retriever.retrieveItem(this.className, rawData);
  }
}

export default QueryResult;
