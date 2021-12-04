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
  statusId: OrderStatus;
  paymentMethod: PaymentMethod;
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
  statusId!: OrderStatus;
  paymentMethod: PaymentMethod;

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
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: OrderStatus.Pending
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
      {
        sequelize,
        tableName: 'orders'
      }
    );
  }

  public static createAssociations() {
  }
}

export const enum OrderStatus {
  Pending = 0,
  Shipped = 1,
  Cancelled = 2
}

export const enum PaymentMethod {
  Invoice = 'Invoice',
  Paypal = 'PayPal'
}
