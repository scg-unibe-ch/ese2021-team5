import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import { Product } from './product.model';


/**
 * the categories for products that the site keeps/exposes
 */
export interface CategoryAttributes {
  categoryId: number;
  name: string;
  description?: string;
}


export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'categoryId'> { }

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public static associations: {
    products: Association<Category, Product>
  };
  categoryId: number;
  name: string;
  description?: string;
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
        tableName: 'categories'
      }
    );
  }
  public static createAssociations() {
    Category.hasMany(Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  }
}
