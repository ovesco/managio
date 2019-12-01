import Document from './Document';

abstract class Edge extends Document {

  protected _from: string;

  protected _to: string;
}

export default Edge;
