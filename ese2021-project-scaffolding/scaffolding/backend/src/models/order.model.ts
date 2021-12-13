import { Optional, Model, DataTypes, Sequelize, Association } from 'sequelize';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';


/**
 * the order data of a user's purchase
 */
export interface OrderAttributes {
  orderId: number;
  userId: number;
  statusId: OrderStatus;
  paymentMethod: PaymentMethod;
  buyerName: string;
  deliveryAddress: string;

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

  public static associations: {
    purchase: Association<Order, Product>
    buyer: Association<Order, User>
  };

  orderId!: number;
  statusId!: OrderStatus;
  paymentMethod: PaymentMethod;
  buyerName: string;
  userId: number;
  deliveryAddress: string;

  public static initialize(sequelize: Sequelize) {
    Order.init({
      orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: OrderStatus.Pending
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true
      },
      buyerName: DataTypes.STRING,
      deliveryAddress: DataTypes.STRING,

      }
    ,
      {
        sequelize,
        tableName: 'orders'
      }
    );
  }

  public static createAssociations() {

    Order.belongsTo(User, {
      foreignKey: 'userId',
      targetKey: 'userId',
      as: 'buyer',
    });

    Order.belongsToMany(Product, {
      through: 'ProductOrders',
      as: 'purchase',
      foreignKey: 'orderId',
      otherKey: 'productId'
    });
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
