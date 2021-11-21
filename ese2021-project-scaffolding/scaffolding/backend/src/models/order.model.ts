// import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

// import { OrderStatus, PaymentMethod } from '../constants';

// /**
//  * the order data of a user's purchase
//  */
// export interface OrderAttributes {
//     orderId: number;
//     purchaserId: number;
//     product: number;
//     status: OrderStatus;
//     paymentMethod: PaymentMethod;
//     /**
//      * address information
//      */
//     firstName: string;
//     lastName: string;
//     street: string;
//     city: string;
//     plz: number;
// }
// export class Order extends Model<OrderAttributes> implements OrderAttributes {
//     orderId: number;
//     purchaserId: number;
//     address: string;
//     product: number;
//     status: OrderStatus;
//     paymentMethod: PaymentMethod;

//     /**
//      * address information
//      */
//     firstName: string;
//     lastName: string;
//     street: string;
//     city: string;
//     plz: number;
//     public static initialize(sequelize: Sequelize) {
//         Order.init({
//             orderId: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             purchaserId: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//             },
//             status: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             paymentMethod: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             product: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false
//             },
//             firstName: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             lastName: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             street: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             city: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             plz: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false
//             }
//         },
//             {
//                 sequelize,
//                 tableName: 'orders'
//             }
//         );
//     }
// }
