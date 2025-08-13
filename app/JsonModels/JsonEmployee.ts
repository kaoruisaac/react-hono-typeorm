import JsonModel from "./JsonModel"

class JsonEmployee extends JsonModel {
  declare hashId: string;
  declare name: string;
  declare email: string;
  declare roles: string[];

  constructor() {
    super();
  }
}

export default JsonEmployee;
