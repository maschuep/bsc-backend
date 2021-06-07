import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import express, { Request, Response } from 'express';
import { Measurement } from '../models/measurement.model';
import { verifyToken } from '../middlewares/checkAuth';
import { Op } from 'sequelize';

export class OverviewController implements ControllerFactory {
    private _path = '/overview';
    private _router = express.Router();
    constructor() {
        this.overview();
        this.lastWeek();
        this.lastDay();
    }

    overview() {
        this._router.get('/:participant', verifyToken, (req: Request, res: Response) => {
            Measurement.findAll({ where: { participant: req.params.participant } }).then(all => {
                res.status(200).send(all.map(a => ({ timestamp: a.timestamp, wh: a.wh })));
            });
        });
    }

    lastWeek() {
        const lastSunday = Date.now() - ((Date.now() - 1000 * 60 * 60 * 24 * 4) % (1000 * 60 * 60 * 24 * 7));
        this._router.get('/lastweek/:participant', verifyToken, (req: Request, res: Response) => {
           this.getBiggerThanTimestamp(lastSunday).then(lw => res.status(200).send(lw))
            .catch(err => res.status(500).send());
        });
    }

    lastDay() {
        const lastDayStart = Date.now() - ((Date.now() - 1000 * 60 * 60 * 24 ) % (1000 * 60 * 60 * 24));
        this._router.get('/lastday/:participant', verifyToken, (req: Request, res: Response) => {
           this.getBiggerThanTimestamp(lastDayStart).then(lw => res.status(200).send(lw))
            .catch(err => res.status(500).send());
        });
    }

    private getBiggerThanTimestamp(ts: number) {
        return Measurement.findAll({
                where: {
                    timestamp: {
                        [Op.gte]: ts
                    }
                }
            });

    }


    getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }
}
