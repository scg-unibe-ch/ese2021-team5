import {User} from "./user.model";
export class Order {

  constructor(
    public user: User | undefined,
    public buyerName: string,
    public paymentMethod: string,
    public deliveryAddress: string,
    public purchase: string,
    public statusIndex: number, //it's easier to use a number instead of a string. (0 = Pending, 1 = Shipped, 2 = Cancelled)
    public orderId: number,
  ) {}
}
