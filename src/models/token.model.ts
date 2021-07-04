import { Model, DataTypes, Sequelize } from 'sequelize';

export interface TokenAttributes {
    tokenId: string;
    token: string;
}

export class Token
    extends Model<TokenAttributes, TokenAttributes>
    implements TokenAttributes {
    tokenId: string;
    token: string;


    public static initialize(sequelize: Sequelize) {
        Token.init({
            tokenId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            token: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

        }
            , {
                tableName: 'tokens',
                sequelize
            });
    }

}
