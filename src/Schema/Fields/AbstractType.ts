abstract class AbstractType {
  toArangoData(value: any) {
    return value;
  }

  fromArangoData(value: any) {
    return value;
  }

  validateValue(value: any) {
    return true;
  }
}

export default AbstractType;
