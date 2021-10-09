import {Account} from "./account.model";

export class User {

  constructor(
    public userId: number,
    public username: string,
    public password: string,
    public account: Account,
  ) {}
}
