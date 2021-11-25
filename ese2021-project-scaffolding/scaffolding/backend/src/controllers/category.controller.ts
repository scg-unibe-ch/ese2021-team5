import express, { Router, Request, Response } from 'express';
import {checkAdmin} from '../middlewares/checkAdmin';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

const categoryController: Router = express.Router();

/**
 * route where categories are accessed via ID rather than category name
 * admin functions
 */



categoryController.get('/:categoryId', (req: Request, res: Response) => {
    const categoryId = parseInt(req.params['categoryId']); 
    return CategoryService.getCategory(categoryId)
        .then(category => res.status(200).send({ success: true, deleted: category }))
        .catch(err => res.status(404).send({ success: false, error: err }));
});

categoryController.post('/:categoryId', (req: Request, res: Response) => {
    const categoryId = parseInt(req.params['categoryId']); 
    const props = req.body;
    return CategoryService.createCategory({
            categoryId,
            ...props
        })
        .then(category => res.status(200).send({ success: true, deleted: category }))
        .catch(err => res.status(500).send({ success: false, error: err }));
});

categoryController.delete('/:categoryId', (req: Request, res: Response) => {
    const categoryId = parseInt(req.params['categoryId']); 
    return CategoryService.deleteCategory(categoryId)
            .then(category => res.status(200).send({ success: true, deleted: category }))
            .catch(err => res.status(500).send({ success: false, error: err }));
});

export const CategoryController: Router = categoryController;
