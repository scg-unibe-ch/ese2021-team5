import express, { Router, Request, Response } from 'express';
import {checkAdmin} from '../middlewares/checkAdmin';
import { Category } from '../models/category.model';

const categoryController: Router = express.Router();


/**
 * accessed via the name of the category rather than the id, which is unknown to users
 * example:  /category/view/example&page=3
 */
categoryController.get('/category/view/:categoryName', (req: Request, res: Response) => {

    const pageNr =  req.params['page'] || 1;
    const conf = {
        pageNr
    }
});

/**
 *  a list of all categories
 */
categoryController.get('/category/list/', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

categoryController.post('/category/add', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

categoryController.post('/category/remove', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

categoryController.post('/category/update', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});


export const CategoryController: Router = categoryController;
