import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import express , {Request, Response} from 'express';
import { Measurement } from '../models/measurement.model';

export class OverviewController implements ControllerFactory {
    private _path = '/overview';
    private _router = express.Router();
    constructor() {
        this.overview();
    }

    overview() {
        this._router.get('/:participant', (req: Request, res: Response ) => {
            Measurement.findAll({where: {participant: req.params.participant}}).then(all => {
                res.status(200).send(all.map(a => ({timestamp: a.timestamp, wh: a.wh})));
            });
        });
    }

    getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }
}
