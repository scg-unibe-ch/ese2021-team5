import { Category, CategoryAttributes } from '../models/category.model';
import { ErrorMessageFactory } from '../utils/utils';
 
const errors = new ErrorMessageFactory('Category');

export class CategoryService {

    static async getCategoryByName(categoryName: string) {
        const found = await Category.findOne({
            where: {
                name: categoryName
            }
        });
        if (!found){
            throw new Error(`[ERROR] Category with name '${categoryName}' not found.`);
        }
        return found
    }

    static async getCategory(categoryId: number) {
        const found = await Category.findByPk(categoryId);
        if (found){
            throw new Error(errors.notFound(categoryId));
        }
        return found
    }

    static async createCategory(info: CategoryAttributes) {
        const found = await Category.findByPk(info.categoryId);
        if (found){
            throw new Error(`[ERROR] Category '${info.categoryId}' already exists.`);
        }
        return Category.create(info)
    }

    static async deleteCategory(categoryId: number) {
        const found = await Category.findByPk(categoryId)
        if (!found){
            throw new Error(errors.notFound(categoryId));
        }
        return found.destroy().then(() => ({ deleted: categoryId }))
    }
}
