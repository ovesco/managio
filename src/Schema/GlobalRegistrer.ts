import Schema from './Schema';

class GlobalRegistrer {

  static instance: GlobalRegistrer;

  public readonly modelTask: Map<Function, Function> = new Map();

  public readonly columnTask: Map<Function, Array<Function>> = new Map();

  public readonly proxyToLegacy: Map<Function, Function> = new Map();

  public readonly legacyToProxy: Map<Function, Function> = new Map();

  static getInstance() {
    if (!GlobalRegistrer.instance) GlobalRegistrer.instance = new GlobalRegistrer();
    return GlobalRegistrer.instance;
  }

  addColumnTask(className: Function, task: (Schema, Function) => void) {
    if (!this.columnTask.has(className)) this.columnTask.set(className, []);
    this.columnTask.get(className).push(task);
  }

  addModelTask(proxyClass: Function, className: Function, task: Function) {
    this.proxyToLegacy.set(proxyClass, className);
    this.legacyToProxy.set(className, proxyClass);
    this.modelTask.set(proxyClass, task);
  }

  processModelTask(className: Function, schema: Schema) {
    this.modelTask.get(className)(schema);
    this.modelTask.delete(className);
  }

  processColumnTasks(proxyClass: Function, schema: Schema) {
    if (this.proxyToLegacy.has(proxyClass)) {
      const originalClass = this.proxyToLegacy.get(proxyClass);
      if (this.columnTask.has(originalClass)) {
        this.columnTask.get(originalClass).forEach((task) => {
          task(schema, proxyClass);
        });
        this.columnTask.delete(originalClass);
      }

    }
  }
}


export default GlobalRegistrer;