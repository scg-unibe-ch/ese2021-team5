
export class Product {

  constructor(
    public categoryId: number,
    public title: string,
    public description: string,
    public imageUri: string,
    public price: number,
  ) {
  }
}
