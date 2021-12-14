import express, { Router, Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { Vote, VoteTypes } from '../models/votes.model';
import { User } from '../models/user.model';
import { verifyToken } from '../middlewares/checkAuth';
import { MulterRequest } from '../models/multerRequest.model';
import * as fs from 'fs';

const postController: Router = express.Router();
const postService = new PostService();

postController.post('/', verifyToken,
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
    Post.findByPk(req.params.id, {include: [ Post.associations.postvotes]}).then(found => {
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
    Post.findAll({include: [ Post.associations.postvotes]})
      .then(post => res.status(200).send(post))
      .catch(err => res.status(500).send(err));
  });


postController.put('/:id', verifyToken, (req: Request, res: Response) => {
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

postController.delete('/:id', verifyToken, (req: Request, res: Response) => {
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
  Vote.findOrCreate({
    where: {
      postId: req.params.id,
      userId: req.body.userId
    }
  })
    .then((vote: [Vote, boolean]) => { // boolean is true if created
      if (!vote[1] && vote[0].type === VoteTypes.Upvote) { return res.status(400).send({ message: 'alreay upvoted' }); }

      Post.findByPk(req.params.id).then((foundPost) => {
        if (!foundPost) { res.status(404).send({ message: 'did not find post' }); }


        foundPost.increment('upvotes', { by: 1 })
          .then(updated => {
            if (!vote[1] && vote[0].type === VoteTypes.Downvote) {
              updated.increment('downvotes', { by: -1 });
            }
            vote[0].update({ 'type': VoteTypes.Upvote })
              .then(result => { res.status(200).send(result); });
          });
      },
        err => { res.status(500).send(`${err} 2`); }
      );

    },
      err => { res.status(500).send(`${err} 3`); }
    );
});

postController.put('/:id/removeUpvote', (req: Request, res: Response) => {
  Vote.findOne({
    where: {
      postId: req.params.id,
      userId: req.body.userId
    }
  })
    .then((foundVote) => {
      if (!foundVote) { return res.status(404).send({ message: 'not upvoted yet' }); }
      if (foundVote.type === VoteTypes.Downvote) { return res.status(400).send({ message: 'this is a downvote' }); }

      Post.findByPk(foundVote.postId)
        .then(foundPost => {
          foundPost.increment('upvotes', { by: -1 });
        },
          err => { res.status(500).send(`${err} 3`); }
        )
        .then(() => {
          foundVote.destroy()
            .then(destroyed => res.status(200).send(destroyed),
              err => res.status(500).send(`${err}`));
        });
    },
      err => { res.status(500).send(`${err} 3`); }
    );
});

postController.put('/:id/downvote', (req: Request, res: Response) => {
  Vote.findOrCreate({
    where: {
      postId: req.params.id,
      userId: req.body.userId
    }
  })
    .then((vote: [Vote, boolean]) => { // boolean is true if created
      if (!vote[1] && vote[0].type === VoteTypes.Downvote) { return res.status(400).send({ message: 'alreay upvoted' }); }

      Post.findByPk(req.params.id).then((foundPost) => {
        if (!foundPost) { res.status(404).send({ message: 'did not find post' }); }

        foundPost.increment('downvotes', { by: 1 })
          .then(updated => {
            if (!vote[1] && vote[0].type === VoteTypes.Upvote) {
              updated.increment('upvotes', { by: -1 });
            }
            vote[0].update({ 'type': VoteTypes.Downvote })
              .then(result => { res.status(200).send(result); });
          });
      },
        err => { res.status(500).send(`${err} 2`); }
      );

    },
      err => { res.status(500).send(`${err} 3`); }
    );
});
postController.put('/:id/removeDownvote', (req: Request, res: Response) => {
  Vote.findOne({
    where: {
      postId: req.params.id,
      userId: req.body.userId
    }
  })
    .then((foundVote) => {
      if (!foundVote) { return res.status(404).send({ message: 'not upvoted yet' }); }
      if (foundVote.type === VoteTypes.Upvote) { return res.status(400).send({ message: 'this is an upvote' }); }

      Post.findByPk(foundVote.postId)
        .then(foundPost => {
          foundPost.increment('downvotes', { by: -1 });
        },
          err => { res.status(500).send(`${err} 3`); }
        )
        .then(() => {
          foundVote.destroy()
            .then(destroyed => res.status(200).send(destroyed),
              err => res.status(500).send(`${err}`));
        });
    },
      err => { res.status(500).send(`${err} 3`); }
    );
});

export const PostController: Router = postController;
