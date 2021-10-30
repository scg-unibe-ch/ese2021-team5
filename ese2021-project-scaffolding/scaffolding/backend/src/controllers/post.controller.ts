import express, { Router, Request, Response } from 'express';
import { PostService } from "../services/post.service";
import { verifyToken } from '../middlewares/checkAuth';

const postController: Router = express.Router();
const postService = new PostService();

postController.use(verifyToken);

postController.post('/create',
  (req: Request, res: Response) => {
    postService.create(req.body).then(create => res.send(create)).catch(err => res.status(500).send(err));
  }
);
postController.post('/read',
  (req: Request, res: Response) => {
    postService.read(req.body).then(read => res.send(read)).catch(err => res.status(500).send(err));
  }
);
postController.post('/update',
  (req: Request, res: Response) => {
    postService.update(req.body).then(update => res.send(update)).catch(err => res.status(500).send(err));
  }
);
postController.post('/delete',
  (req: Request, res: Response) => {
    postService.delete(req.body).then(delete => res.send(delete)).catch(err => res.status(500).send(err));

  }
);
export const PostController: Router = postController;
