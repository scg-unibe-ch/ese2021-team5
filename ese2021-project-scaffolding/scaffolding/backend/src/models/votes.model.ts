import { Optional, Model, DataTypes, Sequelize } from 'sequelize';

export interface VoteAttributes {
  voteId: number;
  postId: number;
  userId: number;
  type?: VoteTypes;
}

export interface VoteCreationAttributes extends Optional<VoteAttributes, 'voteId'> { }

export class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  voteId!: number;
  postId!: number;
  userId!: number;
  type?: VoteTypes;
  public static initialize(sequelize: Sequelize) {
    Vote.init({
      voteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      postId: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: VoteTypes.Zero
      },
    },
      {
        sequelize,
        tableName: 'votes'
      }
    );
  }
}

export const enum VoteTypes {
  Upvote = 1,
  Zero = 0,
  Downvote = -1
}
