import express, { Request, Response, Router } from 'express';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { Measurement, MeasurementAttributes } from '../models/measurement.model';
import { authenticateMeasruements } from '../middlewares/checkAuth';


export class MeasurementController implements ControllerFactory {

    _path: string;
    _router: Router;

    constructor() {
        this._router = express.Router();
        this._path = '/measurement';
        this.create();
    }

    public create() {
        this._router.post('/:participant', authenticateMeasruements, (req: Request, res: Response) => {
            const ms = req.body.map((a: MeasurementAttributes) => { a.participant = req.params.participant; return a; });
            Measurement.bulkCreate(ms)
                .then(() => res.status(201).send())
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
