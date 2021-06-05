import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
    userId: string;
    mail: string;
    password: string;
    firstname: string;
    lastname: string;
    lastLogin: number;
    phone: number;
    participant: string;
}


export class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
    userId: string;
    mail: string;
    password: string;
    firstname: string;
    lastname: string;
    lastLogin: number;
    phone: number;
    participant: string;

    public static initialize(sequelize: Sequelize): void {
        User.init({userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastLogin: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        phone: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        participant: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'unknown'
        }
    },
        {
            sequelize,
            tableName: 'users'
        }
    );
    }

}
