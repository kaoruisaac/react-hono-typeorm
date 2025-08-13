type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

class JsonModel {
  declare load?: typeof JsonModel.load<this>;
  declare update?: typeof JsonModel.update<this>;
  constructor() {
     this.load = JsonModel.load.bind(this);
  }
  static load<T>(obj: NonFunctionProperties<T>): T {
      Object.assign(this, obj);
      return this as T;
  }
  static update<T>(obj: Partial<NonFunctionProperties<T>>): T {
    Object.assign(this, obj);
    return this as T;
  }
}

export default JsonModel;
