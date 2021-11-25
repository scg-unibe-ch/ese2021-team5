import { FindOptions } from 'sequelize/types';
import {Product, ProductAttributes} from '../models/product.model';
import { ErrorMessageFactory } from '../utils/utils';


const errors = new ErrorMessageFactory('Product');

export class ProductService {

    static async getProductById(productId: number): Promise<Product> {
        const product = Product.findByPk(productId);
        if (!product){
            return Promise.reject(errors.notFound(productId))
        }
        return product;
    }

    
    static async getProductsByCategory(categoryId: number, options?: FindOptions<any>): Promise<Product[]> {
    //static async getProductsByCategory(categoryId: number): Promise<Product[]> {
        const product = Product.findAll({
            where: {
                categoryId: categoryId
            },
            ...options
        });
        if (!product){
            return Promise.reject({ 
                success:false, 
                message: `[ERROR] No products found in '${categoryId}'.` 
            })
        }
        return product;
    }

    static async getAll(): Promise<Product[]> {
        return Product.findAll();
    }

    static async modifyProduct(productDetails: ProductAttributes): Promise<Product> {
        const prod = await Product.findByPk(productDetails.productId);
        if (!prod) {
            return Promise.reject(errors.notFound(productDetails.productId))
        }
        try {
            prod.set(productDetails)
        } catch (err){
            return Promise.reject({ 
                success:false, 
                message: `[ERROR] property assignment errors '${JSON.stringify(productDetails)}'.`,
                error: err
            })
        }
        prod.save();
        return prod;
    }



    static async createProduct(product: Product): Promise<Product> {
        return Product.create(product);
    }

    static async deleteProduct(productId: number) {
        const prod = await Product.findByPk(productId)
        if (!prod){
            throw new Error(`[ERROR] Product '${productId}' not found.`);
            //return Promise.reject(errors.notFound(productId));
        }
        return prod.destroy().then(() => ({ deleted: productId }))
    }
    
}

