import express, { Router, Request, Response } from 'express';
import { checkAdmin } from '../middlewares/checkAdmin';
import { Product } from '../models/product.model';

const productController: Router = express.Router();

/**
* get all products
*/
productController.get('/', (req: Request, res: Response) => {
  Product.findAll()
    .then(products => res.status(200).send(products))
    .catch(err => res.status(500).send(err));
});

/**
* get specific product id
*/
productController.get('/:id', (req: Request, res: Response) => {
    Product.findByPk(req.params.id).then(found => {
      if (found != null) {
        res.status(200).send(found);
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(err));
});

/**
* create product
*/
productController.post('/', (req: Request, res: Response) => {
  Product.create(req.body)
    .then(create => {
      res.status(201).send(create);
    })
    .catch(err => res.status(500).send(err));
});

/**
* delete specific product
*/
productController.delete('/:id', (req: Request, res: Response) => {
  Product.findByPk(req.params.id)
    .then(found => {
      if (found != null) {
        found.update({active: false})
          .then(item => res.status(200).send({ deleted: item }))
          .catch(err => res.status(500).send(err));
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => res.status(500).send(err));
});

/**
* update specific product
*/
productController.put('/:id', (req: Request, res: Response) => {
  Product.findByPk(req.params.id).then(found => {
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


export const ProductController: Router = productController;
