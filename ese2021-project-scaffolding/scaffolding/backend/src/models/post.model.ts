import { Optional, Model, Sequelize, DataTypes } from 'sequelize';

export interface PostAttributes {
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
}
