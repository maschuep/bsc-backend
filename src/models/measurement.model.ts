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

    public static initialize(sequelize: Sequelize): void {
        Measurement.init({
            participant: { type: DataTypes.STRING, unique: 'primary' },
            timestamp: { type: DataTypes.INTEGER, unique: 'primary' },
            blinkDuration: { type: DataTypes.INTEGER }
        }, { sequelize, timestamps: false });
    }
}
