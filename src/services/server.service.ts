import express, { Application, Router } from 'express';
import morgan from 'morgan';
import { Controller } from '../interfaces/controller.interface';

export class ServerService {

    constructor() {
        this._express = express()
            .use(express.json())
            .use(morgan('tiny'));
    }

    private _express: Application;

    public static create(controllers?: Controller[]): ServerService {
        const s = new ServerService();
        if (controllers) { s.use(controllers); }
        return s;
    }

    public use(controllers: Controller[]) {
        controllers.forEach(c => c.getRouter(this._express._router));
    }

    public listen(port: number, callback?: () => void) {
        this._express.listen(port, callback);
    }
}
