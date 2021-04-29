import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controller.abstract';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { Measurement } from '../models/measurement.model';


export class MeasurementController implements Controller {

    _router: Router;
    _path: string;

    constructor() {
        this._router = express.Router();
        this._path = 'measurement';
    }

    public create() {
        this._router.post('/', (req: Request, res: Response) => {
            Measurement.bulkCreate(req.body).then(() => res.status(201).send());
        });
    }

    public read() { }
    public update() { }
    public delete() { }

    public controller(): ControllersObject {
        return { path: this._path, controller: this._router };
    }
}
