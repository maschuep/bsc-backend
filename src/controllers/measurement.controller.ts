import express, { Request, Response, Router } from 'express';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { Measurement } from '../models/measurement.model';


export class MeasurementController implements ControllerFactory {

    _router: Router;
    _path: string;

    constructor() {
        this._router = express.Router();
        this._path = 'measurement';
        this.create();
    }

    public create() {
        this._router.post('/', (req: Request, res: Response) => {
            Measurement.bulkCreate(req.body).then(() => res.status(201).send());
        });
    }

    public getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }
}
