import { PostAttributes, Post } from '../models/post.model';

export class PostService {
    /**
     * create
     */
    public create(post: PostAttributes) {

    }
    /**
     * read
     */
    public read() {

    }
    /**
     * update
     */
    public update(post: Post) {

    }
    /**
     * delete
     */
    public delete() {

    }
    public getAll(): Promise<Post[]> {
        return Post.findAll();
    }
}
