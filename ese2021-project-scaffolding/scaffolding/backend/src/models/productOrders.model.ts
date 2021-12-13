import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

export interface ProductOrdersAttirbutes {
  productOrdersId: number;
  orderId: number;
  productId: number;
}

export interface ProductOrdersCreationAttributes extends Optional<ProductOrdersAttirbutes, 'productOrdersId'> { }

export class ProductOrders extends Model<ProductOrdersAttirbutes, ProductOrdersCreationAttributes> implements ProductOrdersAttirbutes {
  productOrdersId!: number;
  orderId!: number;
  productId!: number;
  public static initialize(sequelize: Sequelize) {
    ProductOrders.init({
      productOrdersId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      orderId: {
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
      },
    },
      {
        sequelize,
        tableName: 'productorders'
      }
    );
  }
}
