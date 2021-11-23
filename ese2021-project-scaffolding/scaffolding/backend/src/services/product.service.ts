import {Product, ProductAttributes} from '../models/product.model';
import { ErrorMessageFactory } from '../utils';


const errors = new ErrorMessageFactory('Product');

export class ProductService {

    static async getProductById(productId: number): Promise<Product> {
        const product = Product.findByPk(productId);
        if (!product){
            return Promise.reject({ 
                success:false, 
                message: `[ERROR] Product '${productId}' not found` })
        }
        return product;
    }

    
    static async getProductsByCategory(categoryId: number): Promise<Product[]> {
        const product = Product.findAll({
            where: {
                categoryId: categoryId
            }
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

    public async modifyProduct(productDetails: ProductAttributes): Promise<Product> {
        const prod = await Product.findByPk(productDetails.productId);
        if (!prod) {
            return Promise.reject({ success:false, message: `[ERROR] No product found for '${productDetails.productId}'.` })
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

    public async deleteProduct(productId: number): Promise<void> {
        return Product.findByPk(productId).then(async dbProduct => {
            if (dbProduct) {
                return dbProduct.destroy();
            } else {
                return Promise.reject({message: 'no product with ID ' + productId + ' exists'});
            }
        });
    }

    public async createProduct(product: Product): Promise<Product> {
        return Product.create(product);
    }

    static async deleteProduct(productId: number) {
        const found = await Product.findByPk(productId)
        if (!found){
            throw new Error(`[ERROR] Product '${productId}' not found.`);
        }
        return found.destroy().then(() => ({ deleted: productId }))
    }
}

