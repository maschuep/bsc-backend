import { Model, DataTypes, Sequelize } from 'sequelize';

export interface EventAttributes {
    eventId: number;
    reason: string;
    timestamp: number;
    usage: number;
    average: number;
    deviation: number;
    participant: string;
}

export class Event extends Model<EventAttributes, EventAttributes>
    implements EventAttributes {

    eventId: number;
    reason: string;
    timestamp: number;
    usage: number;
    average: number;
    deviation: number;
    participant: string;

    public static initialize(sequelize: Sequelize): void {
        Event.init({
            eventId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            reason: { type: DataTypes.STRING, allowNull: true },
            timestamp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: Date.now() },
            usage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            deviation: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            average: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            participant: { type: DataTypes.STRING, allowNull: false },
        }, { sequelize, timestamps: false, tableName: 'events' });
    }
}
