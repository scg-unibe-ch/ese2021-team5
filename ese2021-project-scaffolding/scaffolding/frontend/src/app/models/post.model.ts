export class Post {

  constructor(
   public title: string,
   public text: string,
   public creatorId: number, //should this be a user? username?
   public creatorUsername: string
  ) {}
}
