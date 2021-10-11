export class User {

  public address: string | undefined;
  public zip: string | undefined;
  public city: string | undefined;
  public phone: string | undefined;
  public firstname: string | undefined;
  public lastname: string | undefined;
  public email: string | undefined;
  public birthday: string | undefined;

  constructor(
    public userId: number,
    public username: string,
    public password: string,
  ) {}
}
