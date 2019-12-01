import BaseContactable from './BaseContactable';

class Address extends BaseContactable {

  protected street: string;

  protected npa: number;

  protected city: string;
}

export default Address;
