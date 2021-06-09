import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
    userId: number;
    mail: string;
    password: string;
    phone: number;
    participant: string;
    receive_sms: boolean;
    receive_mail: boolean;
    active_participation: boolean;
}

export class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
    userId: number;
    mail: string;
    password: string;
    phone: number;
    participant: string;
    active_participation: boolean;
    receive_mail: boolean;
    receive_sms: boolean;

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
                type: DataTypes.NUMBER,
                allowNull: true,
            },
            participant: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'unknown'
            },
            active_participation: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 'false'
            },
            receive_mail: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 'false'
            },
            receive_sms: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 'false'
            }
        },
            {
                sequelize,
                tableName: 'users'
            }
        );
    }

}
