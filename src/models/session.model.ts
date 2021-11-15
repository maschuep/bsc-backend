import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface SessionAttributes {
    sessionId: number;
    userId: number;
    timestamp: number;
    duration: number;
}

export class Session
extends Model<SessionAttributes, Optional<SessionAttributes, 'sessionId' | 'duration' | 'timestamp'>>
implements SessionAttributes {
    sessionId: number;
    userId: number;
    timestamp: number;
    duration: number;

    public static initialize(sequelize: Sequelize) {
        Session.init({
            sessionId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
            timestamp: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
        }
        , {
            tableName: 'sessions',
            sequelize,
            timestamps: false
        });
    }

}
