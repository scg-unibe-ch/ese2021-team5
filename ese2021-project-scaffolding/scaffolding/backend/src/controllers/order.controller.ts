import express, { Router, Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order.model';

const orderController: Router = express.Router();


/**
 * Create an order
 */
orderController.post('/', (req: Request, res: Response) => {
    Order.create(req.body)
      .then(create => {
        res.status(201).send(create);
      })
      .catch(err => res.status(500).send(err));
});

/**
 * read a specific order
 */
orderController.get('/:id', (req: Request, res: Response) => {
    Order.findByPk(req.params.id).then(found => {
      if (found != null) {
        res.status(200).send(found);
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(err));
});

/**
 * read all orders
 */
orderController.get('/', (req: Request, res: Response) => {
    Order.findAll()
      .then(post => res.status(200).send(post))
      .catch(err => res.status(500).send(err));
});

/**
 * cancels an order
 */
orderController.put('/cancel/:id', (req: Request, res: Response) => {
    Order.findByPk(req.params.id).then(found => {
      if (found != null) {
        found.update({'statusId': OrderStatus.Cancelled})
        .then(updated => {res.status(200).send(updated); });
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(err));
});

/**
 *ships an order
 */
orderController.put('/ship/:id', (req: Request, res: Response) => {
    Order.findByPk(req.params.id).then(found => {
      if (found != null) {
        found.update({'statusId': OrderStatus.Shipped})
        .then(updated => {res.status(200).send(updated); });
      } else {
        res.sendStatus(404);
      }
    })
      .catch(err => res.status(500).send(err));
});

export const OrderController: Router = orderController;
