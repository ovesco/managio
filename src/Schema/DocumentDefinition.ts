import { ClassType } from '../Types';
import AbstractDefinition from './AbstractDefinition';
import EdgeDefinition from './EdgeDefinition';

export interface DocumentOptions {
  collectionName: string,
  repositoryClass?: ClassType,
}

class DocumentDefinition extends AbstractDefinition {

  public readonly fromInEdges: Array<EdgeDefinition> = [];

  public readonly toInEdges: Array<EdgeDefinition> = [];

  get options(): DocumentOptions {
    return this.$options as DocumentOptions;
  }
}

export default DocumentDefinition;
