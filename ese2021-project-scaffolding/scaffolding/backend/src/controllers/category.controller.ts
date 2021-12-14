import express, { Router, Request, Response } from 'express';
import { Category } from '../models/category.model';

const categoryController: Router = express.Router();


categoryController.get('/', (req: Request, res: Response) => {
  Category.findAll()
    .then(category => res.status(200).send(category))
    .catch(err => res.status(500).send(err));
});

/**
 */
categoryController.get('/:id', (req: Request, res: Response) => {
    Category.findByPk(req.params.id, {include: [Category.associations.products]}).then(found => {
      if (found != null) {
        res.status(200).send(found);
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(`${err}`));

});

// everything below is not used by frontend

categoryController.post('/', (req: Request, res: Response) => {
  Category.create(req.body)
    .then(create => {
      res.status(201).send(create);
    })
    .catch(err => res.status(500).send(err));
});

categoryController.put('/:id', (req: Request, res: Response) => {
  Category.findByPk(req.params.id).then(found => {
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

categoryController.delete('/:id', (req: Request, res: Response) => {
  Category.findByPk(req.params.id)
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


export const CategoryController: Router = categoryController;
