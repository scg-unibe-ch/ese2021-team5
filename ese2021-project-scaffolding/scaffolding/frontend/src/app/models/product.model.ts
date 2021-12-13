
export class Product {

  public paymentWithInvoice: boolean = true;

  constructor(
    public categoryId: number,
    public title: string,
    public description: string,
    public imageUri: string,
    public price: number,
    public productId: number,
  ) {
  }
}
