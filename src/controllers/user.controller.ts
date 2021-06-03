import express, { Request, Response, Router } from 'express';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController implements ControllerFactory {


    _path: string;
    _router: Router;

    constructor() {
        this._router = express.Router();
        this._path = '/user';
        this.login();
    }

    public getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }

    public login() {
        this._router.post('/login', (req: Request, res: Response) => {
            const secret = process.env.JWT_SECRET;
            User.findOne({
                where: {mail: req.body.mail}
            }).then( user => {
                if (bcrypt.compareSync(req.body.password, user.password)) {// compares the hash with the password from the lognin request
                    const token: string = jwt.sign({ userName: user.mail, userId: user.userId }, secret, { expiresIn: '2h' });
                    return res.status(200).send({ userName: user.mail, userId: user.userId, token });
                } else {
                    return res.status(403).send({ message: 'not authorized' });
                }
            }
            ).catch(err => {
                console.log(err);
                return res.status(500).send({ message: err });
            });
        });
    }

}