import express, { Router, Request, Response } from 'express';
import {checkAdmin} from '../middlewares/checkAdmin';

const productController: Router = express.Router();


productController.get('/product/view/:id', (req: Request, res: Response) => {

});

productController.post('/product/add', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

productController.post('/product/remove', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

productController.post('/product/update', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});


export const ProductController: Router = productController;
