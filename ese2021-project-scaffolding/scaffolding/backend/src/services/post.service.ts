import { PostAttributes, Post } from '../models/post.model';

export class PostService {

    public getAll(): Promise<Post[]> {
        return Post.findAll();
    }
}
