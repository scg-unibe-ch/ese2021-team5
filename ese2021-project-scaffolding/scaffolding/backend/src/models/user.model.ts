import { TodoItem, TodoItemAttributes, TodoItemCreationAttributes } from './todoitem.model';
import { Optional, Model, Sequelize, DataTypes } from 'sequelize';

export interface UserAttributes {
    userId: number;
    userName: string;
    password: string;
    admin: boolean;
    phoneNumber: number;
    street: string;
    city: string;
    firstName: string;
    lastName: string;
    email: string;
    plz: number;
    birthday: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    userId!: number;
    userName!: string;
    password!: string;
    admin!: boolean;
    phoneNumber: number;
    street: string;
    city: string;
    firstName: string;
    lastName: string;
    email: string;
    plz: number;
    birthday: Date;

    public static initialize(sequelize: Sequelize) {
        User.init({
            userId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            street: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.STRING,
            },
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            plz: {
                type: DataTypes.INTEGER,
            },
            phoneNumber: {
                type: DataTypes.INTEGER
            },
            birthday: {
                type: DataTypes.DATEONLY
            },
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }
}
