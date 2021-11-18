import {Product} from "./product.model";
export class Order {

  constructor(
    public Username: string,
    public PaymentMethod: string,
    public deliveryAddress: string,
    public product: Product,
    public orderStatus: string,
  ) {}
}
