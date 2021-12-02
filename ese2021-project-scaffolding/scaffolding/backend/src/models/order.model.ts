import { Optional, Model, DataTypes, Sequelize } from 'sequelize';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';


/**
 * the order data of a user's purchase
 */
export interface OrderAttributes {
  orderId: number;
  purchaserId: number;
  productId: number;
  status: OrderStatus;
  // paymentMethod: PaymentMethod;
  /**
   * address information
   */
  // firstName: string;
  // lastName: string;
  // street: string;
  // city: string;
  // plz: number;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'orderId'> { }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  orderId!: number;
  purchaserId!: number;
  productId!: number;
  status!: OrderStatus;
  // paymentMethod: PaymentMethod;

  public static initialize(sequelize: Sequelize) {
    Order.init({
      orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      purchaserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: OrderStatus.Pending
      },
      // paymentMethod: {
      //     type: DataTypes.STRING,
      //     allowNull: false
      // },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
      {
        sequelize,
        tableName: 'orders'
      }
    );
  }

  public static createAssociations() {
    Order.hasOne(Product, {
      as: 'merchandise',
      foreignKey: 'orderId'
    });
    Order.belongsTo(User, {
      targetKey: 'userId',
      as: 'buyer',
      onDelete: 'cascade',
      foreignKey: 'userId'
    });
  }
}

export const enum OrderStatus {
  Pending = 'Pending',
  Shipped = 'Shipped/Done',
  Cancelled = 'Cancelled'
}
