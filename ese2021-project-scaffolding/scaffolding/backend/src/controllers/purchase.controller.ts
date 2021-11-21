import express, { Router, Request, Response } from 'express';

const purchaseController: Router = express.Router();


/**
 *
 */
purchaseController.post('/submit-purchase', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

/**
 * on success, cancels an order
 */
purchaseController.post('/cancel-purchase', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

/**
 *  user shopping cart functionality
 */
purchaseController.get('/cart/show-items', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

purchaseController.post('/cart/remove-item', (req: Request, res: Response) => {
  /**
     * unimplemented
     */

});



export const PurchaseController: Router = purchaseController;
