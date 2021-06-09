import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface ParticipantAttributes {
    participantId: string;
    num_people: number;
    housing_type: string;
    heating_type: string;
}

export class Participant
extends Model<ParticipantAttributes, ParticipantAttributes>
implements ParticipantAttributes {
    participantId: string;
    num_people: number;
    housing_type: string;
    heating_type: string;

    public static initialize(sequelize: Sequelize) {
        Participant.init({
            participantId: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            num_people: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            housing_type: {
                type: DataTypes.ENUM('Wohnung', 'Freistehendes Haus', 'Mehrfamilienhaus'),
                allowNull: false
            },
            heating_type: {
                type: DataTypes.ENUM('Öl', 'Erdwärme', 'Pellets', 'Stückholz'),
                allowNull: false
            }
        }
        , {
            tableName: 'participants',
            sequelize,
            timestamps: false
        });
    }

}
