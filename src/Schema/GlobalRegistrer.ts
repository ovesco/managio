import Schema from './Schema';
import Manager from '../Manager';

class GlobalRegistrer {

  static instance: GlobalRegistrer;

  public readonly modelTask: Map<Function, Function> = new Map();

  public readonly columnTask: Map<Function, Array<Function>> = new Map();

  public readonly postProcessingTask: Map<Function, Array<Function>> = new Map();

  static getInstance() {
    if (!GlobalRegistrer.instance) GlobalRegistrer.instance = new GlobalRegistrer();
    return GlobalRegistrer.instance;
  }

  addColumnTask(className: Function, task: (schema: Schema, task: Function) => void) {
    if (!this.columnTask.has(className)) this.columnTask.set(className, []);
    this.columnTask.get(className).push(task);
  }

  addPostProcessingTask(className: Function, task: (manager: Manager) => void) {
    if (!this.postProcessingTask.has(className)) this.postProcessingTask.set(className, []);
    this.postProcessingTask.get(className).push(task);
  }

  addModelTask(className: Function, task: (schema: Schema) => void) {
    this.modelTask.set(className, task);
  }

  processModelTask(className: Function, schema: Schema) {
    this.modelTask.get(className)(schema);
    this.modelTask.delete(className);
  }

  processPostProcessingTasks(className: Function, manager: Manager) {
    if (this.postProcessingTask.has(className)) {
      this.postProcessingTask.get(className).forEach((task) => task(manager));
      this.postProcessingTask.delete(className);
    }
  }

  processColumnTasks(className: Function, schema: Schema) {
    if (this.columnTask.has(className)) {
      this.columnTask.get(className).forEach((task) => task(schema, className));
      this.columnTask.delete(className);
    }
  }
}


export default GlobalRegistrer;
