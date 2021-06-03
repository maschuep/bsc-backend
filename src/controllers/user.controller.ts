import express, { Request, Response, Router } from 'express';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';

export class UserController implements ControllerFactory {


    _path: string;

    constructor(private _router: Router) {
        this._path = '/user';
        this.login();
    }

    public getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }

    public login() {
        this._router.post('/login', (req: Request, res: Response) => {
            const secret = process.env.JWT_SECRET;
            console.log(secret, req.body);
            res.status(555).send();
        });
    }

}
