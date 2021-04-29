import express, { Application, Router } from 'express';
import morgan from 'morgan';
import { ControllerFactory } from '../interfaces/controller-factory.interface';

export class ServerService {

    constructor() {
        this._express = express()
            .use(express.json())
            .use(morgan('tiny'));
    }

    private _express: Application;

    public static create(controllers?: ControllerFactory[]): ServerService {
        const s = new ServerService();
        if (controllers) { s.use(controllers); }
        return s;
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
