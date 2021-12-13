import express, { Router, Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { ProductOrders } from '../models/productOrders.model';
import { verifyToken } from '../middlewares/checkAuth';

const orderController: Router = express.Router();

orderController.use(verifyToken);

/**
 * Create an order
 * and yes... this probably needs refactoring
 */
orderController.post('/', (req: Request, res: Response) => {

  Order.create(req.body)
    .then(create => {
      // let's create the product associations
      req.body.purchase.forEach((purchasedItemId: number) => {

        // we need to check if the products actually exist.
        Product.findByPk(purchasedItemId).then((found: Product) => {
          if (found == null) {
            // this does not work. it will fill in all the correct ones and not throw an error
            // maybe i should do it with a middleware
            res.status(404).end();
            return;
          } else {
            // we need to create the associations for order
            ProductOrders.create({ 'orderId': create.orderId, 'productId': found.productId })
              // no need to send anything back
              .catch(err => res.status(500).send(` ${err} `));
          }
        })
          .catch(err => res.status(500).send(` ${err} `));
      });

      // now lets send back the created order
      res.status(201).send(create);
    }, err => res.status(500).send(` ${err} `));

});

/**
 * read a specific order
 */
orderController.get('/:id', (req: Request, res: Response) => {
  Order.findByPk(req.params.id, { include: [Order.associations.buyer, Order.associations.purchase] }).then(found => {
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
  Order.findAll({ include: [Order.associations.buyer , Order.associations.purchase] })
    .then(post => res.status(200).send(post))
    .catch(err => res.status(500).send(err));
});

/**
 * cancels an order
 */
orderController.put('/cancel/:id', (req: Request, res: Response) => {
  Order.findByPk(req.params.id).then(found => {
    if (found != null) {
      found.update({ 'statusId': OrderStatus.Cancelled })
        .then(updated => { res.status(200).send(updated); });
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
      found.update({ 'statusId': OrderStatus.Shipped })
        .then(updated => { res.status(200).send(updated); });
    } else {
      res.sendStatus(404);
    }
  })
    .catch(err => res.status(500).send(err));
});

export const OrderController: Router = orderController;
