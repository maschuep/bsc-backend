import express, { Application, NextFunction, RequestHandler, Router } from 'express';
import morgan from 'morgan';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import cors from 'cors';

export class ServerService {

    private _express: Application;

    constructor(controllers: ControllerFactory[]) {
        this._express = express()
            .use(express.json())
            .use(morgan('tiny'))
            .use(cors({origin: '*', allowedHeaders: '*'}));
        if (controllers) { this.use(controllers); }
    }

    public use(controllers: ControllerFactory[]) {
        controllers
            .map(c => c.getPathAndRouter())
            .forEach(r => this._express.use(r.path, r.controller));
    }

    public listen(port: number, callback?: () => void) {
        this._express.listen(port, callback);
    }

}
