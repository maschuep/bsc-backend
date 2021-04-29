import { Model, DataTypes, Sequelize } from 'sequelize';

export interface MeasurementAttributes {
    participant: string;
    timestamp: number;
    blinkDuration: number;
}



export class Measurement extends Model<MeasurementAttributes, MeasurementAttributes>
    implements MeasurementAttributes {

    participant: string;
    timestamp: number;
    blinkDuration: number;

    static initialize(sequelize: Sequelize): void {
        Measurement.init({
            participant: { type: DataTypes.STRING, primaryKey: true },
            timestamp: { type: DataTypes.INTEGER, primaryKey: true },
            blinkDuration: { type: DataTypes.INTEGER }
        }, { sequelize, timestamps: false });
    }
}
