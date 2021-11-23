import express, { Router, Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { ErrorMessageFactory } from '../utils/utils';
import { parseQuery } from '../middlewares/parseRequest';


/**
 * where the user accesses the store via readable category names
 * rather than the id, which is unknown to users
 * example: http://www.domain.com/store/{categoryName}?page=1
 */
interface ParsedQuery {
    page: number
}

const storeFrontConfig = {
    //maxProductsPerPage
    pageSize: 20
}

const app: Router = express.Router();


const categoryErrors = new ErrorMessageFactory('Category');
const productErrors = new ErrorMessageFactory('Product');

app.use('/:categoryName', parseQuery);

app.get('/:categoryName', (req: Request<any,any,any, ParsedQuery>, res: Response) => {
    const categoryName = req.params.categoryName;
    // query is std defined?
    const pageNr = req.query.page || 1;
    const findOptions = {
        offset: pageNr * storeFrontConfig.pageSize,
        limit: storeFrontConfig.pageSize
    }
    // Promise.then for performance reasons
    CategoryService.getCategoryByName(categoryName).then(async (cat) => {
       const prodList = await ProductService.getProductsByCategory(cat.categoryId, findOptions);
        res.send(prodList)
    }).catch(err => {
        res.status(404).send(categoryErrors.notFound(categoryName))
    })
});

export const StoreController: Router = app;
