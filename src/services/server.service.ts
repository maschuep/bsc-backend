import express, { Application, Router } from 'express';
import morgan from 'morgan';
import { ControllerFactory } from '../interfaces/controller-factory.interface';

export class ServerService {

    private _express: Application;

    constructor(controllers: ControllerFactory[]) {
        this._express = express()
                .use(express.json())
            .use(morgan('tiny'));
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
