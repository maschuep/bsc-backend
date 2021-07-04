import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
    userId: number;
    mail: string;
    password: string;
    phone: string;
    participant: string;
    active: boolean;
    lastNotification: number;

}

export class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
    userId: number;
    mail: string;
    password: string;
    phone: string;
    participant: string;
    active: boolean;
    lastNotification: number;



    public static initialize(sequelize: Sequelize): void {
        User.init({
            userId: {
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
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            participant: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'unknown'
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 'true'
            },
            lastNotification: {
                type: DataTypes.NUMBER,
                allowNull: false,
                defaultValue: 0
            }
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }

}
