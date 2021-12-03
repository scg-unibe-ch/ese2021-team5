

export class Post {

  public pictureFileName: string = '';

  constructor(
   public title: string,
   public category: string,
   public text: string,
   public creatorId: number, //should this be a user? username?
   public creatorUsername: string,
   public pictureLink: string, //can either link to external file, or image in backend
   public pictureId: number, //used to find images in backend, could be expanded to array
   public postId: number,
   public postRank: number, //calculated from votes
   public PostComments: string[],

  ) {
    }
  }

