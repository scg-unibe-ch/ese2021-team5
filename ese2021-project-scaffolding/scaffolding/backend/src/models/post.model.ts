import { Association, Optional, Model, Sequelize, DataTypes } from 'sequelize';
import { PostImage } from '../models/postImage.model';
import { User } from './user.model';

export interface PostAttributes {
  postId: number;
  title: string;
  category: string;
  text: string;
  creatorId: number;
  creatorUsername: string;
  pictureLink: string;
  upvotes: number;
  downvotes: number;
  pictureId: number;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'postId'> { }

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {

  public static associations: {
    postvotes: Association<Post, User>
  };

  postId!: number;
  title: string;
  category: string;
  text: string;
  creatorId!: number;
  creatorUsername: string;
  pictureLink: string;
  upvotes: number;
  downvotes: number;
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
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      downvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    // Post.hasMany(PostImage, {
    //   as: 'images',
    //   foreignKey: 'postId'
    // });
    Post.belongsToMany(User, {
      through: 'Vote',
      as: 'postvotes',
      foreignKey: 'postId',
      otherKey: 'userId'
    });
  }
}
