import express, { Request, Response, Router } from 'express';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { Measurement, MeasurementAttributes } from '../models/measurement.model';
import { authenticateMeasruements } from '../middlewares/checkAuth';
import sequelize, { QueryTypes } from 'sequelize';
import { EventService } from '../services/event.service';


export class MeasurementController implements ControllerFactory {

    _path: string;
    _router: Router;

    constructor() {
        this._router = express.Router();
        this._path = '/measurement';
        this.create();
        this.info();
        this.participants();
    }

    public info() {
        this._router.get('/info', (req: Request, res: Response) => {
            Measurement.sequelize
                .query('select participant, wh, max(timestamp) as timestamp from measurements group by participant;',
                    { type: QueryTypes.SELECT })
                .then(all => all.map((a: any) => {a.date = new Date(a.timestamp); return a; }))
                .then(all => res.status(200).send(all));
        });
    }

    public participants() {
        this._router.get('/participants', (req: Request, res: Response) => {
            Measurement.sequelize
                .query('select distinct participant from measurements;', { type: QueryTypes.SELECT })
                .then((all: Measurement[]) => res.status(200)
                    .send(all.reduce((acc, curr) => {
                        acc.push(curr.participant);
                        return acc;
                    },
                        [])));
        });
    }

    public create() {
        this._router.post('/:participant', authenticateMeasruements, (req: Request, res: Response) => {
            const ms = req.body.map((a: MeasurementAttributes) => { a.participant = req.params.participant; return a; });

            Measurement.bulkCreate(ms)
                .then((a) => {
                    res.status(201).send();

                    Measurement.findAll({ where: { participant: req.params.participant } }).then(all => {
                        EventService.createEventAndNotify(all, req.params.participant);
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500);
                });
        });
    }

    public getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }
}
