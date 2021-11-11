import express, { Router, Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { verifyToken } from '../middlewares/checkAuth';
import { MulterRequest } from '../models/multerRequest.model';
import * as fs from 'fs';


const postController: Router = express.Router();
const postService = new PostService();

// postController.use(verifyToken);

postController.post('/',
  (req: Request, res: Response) => {
    Post.create(req.body)
      .then(create => {
        res.status(201).send(create);
      })
      .catch(err => res.status(500).send(err));
  }
);

// add image to a post
postController.post('/:id/image', (req: MulterRequest, res: Response) => {
  postService.addImage(req).then(created => res.send(created)).catch(err => res.status(500).send(err));
});

// get the filename of an image
postController.get('/:id/image', (req: Request, res: Response) => {
  postService.getImagePost(Number(req.params.id)).then(products => res.send(products))
    .catch(err => res.status(500).send(err));
});

// delete an image

postController.delete('/image/:fileToBeDeletedName',
    (req: Request, res: Response) => {
        fs.unlink('./uploads/' + req.params.fileToBeDeletedName, (err) => {
            if (err) { res.sendStatus(404); } else {
                res.sendStatus(204); // 204 tells the frontend that there is no content sent with the response
            }                              // 200 would result in a failure to parse
        });

    });


// return specific post
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

// return all posts
postController.get('/',
  (req: Request, res: Response) => {
    Post.findAll()
      .then(post => res.status(200).send(post))
      .catch(err => res.status(500).send(err));
  });


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

postController.put('/:id/upvote', (req: Request, res: Response) => {
  Post.findByPk(req.params.id).then(found => {
    if (found != null) {
      found.increment('upvotes', { by: 1 })
        .then(updated => { res.status(200).send(updated); });
    }
  });
});

postController.put('/:id/downvote', (req: Request, res: Response) => {
  Post.findByPk(req.params.id).then(found => {
    if (found != null) {
      found.increment('downvotes', { by: 1 })
        .then(updated => { res.status(200).send(updated); });
    }
  });
});

export const PostController: Router = postController;
