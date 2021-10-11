export class Account {
  public email: string | undefined;
  public address: string| undefined;
  public phone: string| undefined;
  public zip: string| undefined;
  public city: string| undefined;
  public birthday: string| undefined;
  constructor(
    public firstname: string,
    public lastname: string
    //public address: Address, --> should we use a separate model for the address?
    //etc.
  ) {}
}
