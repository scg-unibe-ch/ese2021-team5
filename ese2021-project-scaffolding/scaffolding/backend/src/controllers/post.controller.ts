import express, { Router, Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { verifyToken } from '../middlewares/checkAuth';
import { MulterRequest } from '../models/multerRequest.model';

const postController: Router = express.Router();
const postService = new PostService();

// postController.use(verifyToken);

postController.post('/',
  (req: Request, res: Response) => {
    Post.create(req.body)
    .then(create => {
        res.status(201).send(create); })
    .catch(err => res.status(500).send(err));
  }
);
// add image to a todoItem
postController.post('/:id/image', (req: MulterRequest, res: Response) => {
  postService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// get the filename of an image
postController.get('/:id/image', (req: Request, res: Response) => {
  postService.getImagePost(Number(req.params.id)).then(products => res.send(products))
    .catch(err => res.status(500).send(err));
});
postController.get('/:id',
  (req: Request, res: Response) => {
    Post.findByPk(req.params.id).then(found => {
      if (found != null) {
          res.status(200).send(found);
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(err));
  }
);

// ---inserted by Andri (without really understanding what he's doing)
postController.get('/',
    (req: Request, res: Response) => {
    Post.findAll()
        .then(post => res.status(200).send(post))
        .catch(err => res.status(500).send(err));
    });
// -------

postController.put('/:id', (req: Request, res: Response) => {
  Post.findByPk(req.params.id).then(found => {
    if (found != null) {
      found.update(req.body).then(updated => {
        res.status(200).send(updated);
      });
    } else {
      res.sendStatus(404);
    }
  })
    .catch(err => res.status(500).send(err));
});

postController.delete('/:id', (req: Request, res: Response) => {
  Post.findByPk(req.params.id)
    .then(found => {
      if (found != null) {
        found.destroy()
          .then(item => res.status(200).send({ deleted: item }))
          .catch(err => res.status(500).send(err));
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => res.status(500).send(err));
});

export const PostController: Router = postController;
