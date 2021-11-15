import { Category, CategoryAttributes } from '../models/category.model';
import { Result } from '../types';


export class CategoryService {

    public async add(info: CategoryAttributes): Promise<Result> {
        const c = await Category.findOne({
            where: {
                name: info.name
            }
        });
        if (!c){
            const init = await Category.create(info);
        }
        return {
            success: true
        }
        

    }
}