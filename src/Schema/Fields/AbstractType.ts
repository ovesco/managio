abstract class AbstractType {
  toArangoData(value: any) {
    return value;
  }

  fromArangoData(value: any) {
    return value;
  }
}

export default AbstractType;