import { Post } from '../models/post.model';
import { PostImageAttributes, PostImage } from '../models/postImage.model';
import { MulterRequest } from '../models/multerRequest.model';
import { upload } from '../middlewares/fileFilter';

export class PostService {

  public addImage(req: MulterRequest): Promise<PostImageAttributes> {
    return Post.findByPk(req.params.id) // params.id is read from the url
      .then(found => {
        if (!found) {
          return Promise.reject('Product not found!');
        } else {
          return new Promise<PostImageAttributes>((resolve, reject) => {
            upload.single('image')(req, null, (error: any) => {
              PostImage.create({ fileName: req.file.filename, postId: found.postId })
                .then(created => resolve(created))
                .catch(() => reject('Could not upload image!'));
            });
          });
        }
      })
      .catch(() => Promise.reject('Could not upload image!'));
  }

  public getImagePost(imageId: number): Promise<PostImage> {
    return PostImage.findByPk(imageId)
      .then(image => {
        if (image) {
          return Promise.resolve(image);
        } else {
          return Promise.reject('image not found!');
        }
      })
      .catch(() => Promise.reject('could not fetch the image!'));
  }

  public getAll(): Promise<Post[]> {
    return Post.findAll();
  }
}
