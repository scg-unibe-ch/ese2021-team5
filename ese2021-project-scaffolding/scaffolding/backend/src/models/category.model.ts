import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';


/**
 * the categories for products that the site keeps/exposes
 */
export interface CategoryAttributes {
    categoryId: number;
    name: string;
    description?: string
}


export class Category extends Model<CategoryAttributes> implements CategoryAttributes {
    categoryId: number;
    name: string;
    description?: string
    public static initialize(sequelize: Sequelize) {
        Category.init({
            categoryId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            }
        },
            {
                sequelize,
                tableName: 'products'
            }
        );
    }
}