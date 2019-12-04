import Schema from './Schema';

class GlobalRegistrer {

  static instance: GlobalRegistrer;

  public readonly modelTask: Map<Function, Function> = new Map();

  public readonly columnTask: Map<Function, Array<Function>> = new Map();

  static getInstance() {
    if (!GlobalRegistrer.instance) GlobalRegistrer.instance = new GlobalRegistrer();
    return GlobalRegistrer.instance;
  }

  addColumnTask(className: Function, task: (Schema) => void) {
    if (!this.columnTask.has(className)) this.columnTask.set(className, []);
    this.columnTask.get(className).push(task);
  }

  addModelTask(className: Function, task: Function) {
    this.modelTask.set(className, task);
  }

  processModelTask(className: Function, schema: Schema) {
    this.modelTask.get(className)(schema);
    this.modelTask.delete(className);
  }

  processColumnTasks(className: Function, schema: Schema) {
    if (this.columnTask.has(className)) {
      this.columnTask.get(className).forEach((task) => {
        task(schema);
      });
      this.columnTask.delete(className);
    }
  }
}


export default GlobalRegistrer;