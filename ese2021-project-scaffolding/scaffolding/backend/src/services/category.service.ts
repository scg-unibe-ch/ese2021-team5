import { Category, CategoryAttributes } from '../models/category.model';
 
type o = ReturnType<string>
export class CategoryService {


    


    static async findIdByName(categoryName: string) {
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

    static async getProductsInCategory(categoryId: number) {
        const found = await Category.findByPk(categoryId);
        if (found){
            throw new Error(`[ERROR] Category '${categoryId}' not found.`);
        }
        return found
    }
    static async getCategory(categoryId: number) {
        const found = await Category.findByPk(categoryId);
        if (found){
            throw new Error(`[ERROR] Category '${categoryId}' not found.`);
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

    static async deleteCategory(categoryId: string) {
        const found = await Category.findByPk(categoryId)
        if (!found){
            throw new Error(`[ERROR] Category '${categoryId}' not found.`);
        }
        return found.destroy().then(() => ({ deleted: categoryId }))
    }
}
