import express, { Router, Request, Response } from 'express';
import {checkAdmin} from '../middlewares/checkAdmin';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

const storefrontController: Router = express.Router();


/**
 * accessed via the name of the category rather than the id, which is unknown to users
 * example:  /category/view/example&page=3
 */
storefrontController.get('/store/:categoryName', (req: Request, res: Response) => {
    const categoryName = req.params.categoryName;
    CategoryService.findIdByName(categoryName).then(id => CategoryService.getAllProducts(id))
    CategoryService.getAllProductsForName()
    const pageNr =  req.params['page'] || 1;
    const conf = {
        pageNr
    };
});

/**
 *  a list of all categories
 */
categoryController.get('/category/list/', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

/**
 * REST API
 */

categoryController.get('/category/:categoryId', (req: Request, res: Response) => {
    const categoryId = req.params['categoryId']; 
    return CategoryService.getCategory(categoryId)
        .then(category => res.status(200).send({ success: true, deleted: category }))
        .catch(err => res.status(404).send({ success: false, error: err }));
});

categoryController.post('/category/:categoryId', (req: Request, res: Response) => {
    const categoryId = req.params['categoryId']; 
    return CategoryService.createCategory({
            categoryId,
            description: req.body['description']
        })
        .then(category => res.status(200).send({ success: true, deleted: category }))
        .catch(err => res.status(500).send({ success: false, error: err }));
});

categoryController.delete('/category/:categoryId', (req: Request, res: Response) => {
    const categoryId = req.params['categoryId']; 
    return CategoryService.deleteCategory(categoryId)
            .then(category => res.status(200).send({ success: true, deleted: category }))
            .catch(err => res.status(500).send({ success: false, error: err }));
});


/**
 * JSON API
 */

categoryController.post('/category/add', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});

categoryController.post('/category/delete', (req: Request, res: Response) => {
    /**
     * unimplemented
     */
});


export const CategoryController: Router = categoryController;
