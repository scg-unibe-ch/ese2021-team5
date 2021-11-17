import { Optional, Model, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, DataTypes, Sequelize, Association } from 'sequelize';


/**
 * the store items sold
 */
export interface ProductAttributes {
    productId: number;

    // in which category the item is
    categoryId?: number;
    title: string;
    description?: string;
    imageUri?: string;
    price: number;
}


export class Product extends Model<ProductAttributes> implements ProductAttributes {
    productId: number;

    // in which category the item is
    categoryId: number;
    title: string;
    description: string;
    imageUri: string;
    price: number;
    public static initialize(sequelize: Sequelize) {
        Product.init({
            productId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            categoryId: {
                type: DataTypes.INTEGER,
                defaultValue: null,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            },
            imageUri: {
                type: DataTypes.STRING
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
            {
                sequelize,
                tableName: 'products'
            }
        );
    }
}
