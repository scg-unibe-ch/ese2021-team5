import { Optional, Model, Sequelize, DataTypes } from 'sequelize';
import {PostImage} from '../models/postImage.model';

export interface PostAttributes {
  postId: number;
  title: string;
  category: string;
  text: string;
  creatorId: number;
  creatorUsername: string;
  pictureLink: string;
  pictureId: number;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  postId!: number;
  title: string;
  category: string;
  text: string;
  creatorId!: number;
  creatorUsername: string;
  pictureLink: string;
  pictureId: number;

  public static initialize(sequelize: Sequelize) {
    Post.init({
      postId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      creatorId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: DataTypes.STRING,
      category: DataTypes.STRING,
      text: DataTypes.STRING,
      creatorUsername: DataTypes.STRING,
      pictureLink: DataTypes.STRING,
      pictureId: DataTypes.NUMBER,
    },
      {
        sequelize,
        tableName: 'posts'
      }
    );
  }
    public static createAssociations() {
        Post.hasMany(PostImage, {
            as: 'images',
            foreignKey: 'postId'
        });
    }
}
