import express, { Router, Request, Response } from 'express';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { verifyToken } from '../middlewares/checkAuth';
import { Event } from '../models/event.model';
import { SessionService } from '../services/session.service';



export class EventController implements ControllerFactory {


    _path: string;
    _router: Router;

    constructor() {
        this._router = express.Router();
        this._path = '/event';
        this.update();
        this.getByParticipant();
    }

    public getByParticipant() {
        this._router.get('/:participant', verifyToken, (req: Request, res: Response) => {
            SessionService.trackSession(req.body.tokenPayload.session);
            Event.findAll({where: {participant: req.params.participant}})
            .then(found => res.status(200).send(found))
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
        });
    }

    public update() {
        this._router.patch('/', verifyToken, (req: Request, res: Response) => {
            SessionService.trackSession(req.body.tokenPayload.session);
            Event.findByPk(req.body.eventId)
                .then(found => {
                    found.update(req.body).then(ans => res.status(200).send());
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        });
    }

    getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }

}
