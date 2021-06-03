import * as dotenv from 'dotenv';
import express, {Router} from 'express';
import { MeasurementController } from './controllers/measurement.controller';
import { UserController } from './controllers/user.controller';
import { Measurement } from './models/measurement.model';
import { ServerService } from './services/server.service';
import { StorageService } from './services/storage.service';

export class Server {

    private _server: ServerService;
    private _storage: StorageService;
    private _port: number;

    constructor() {

        const router = express.Router();
        dotenv.config();
        this._port = Number.parseInt(process.env.PORT, 10) || 3001;

        this._server = new ServerService([new MeasurementController(router), new UserController(router)]);
        this._storage = new StorageService([Measurement.initialize]);



        this._server.listen(this._port, () => console.log(`server listening at http://localhost:${this._port}`));
    }
}

const server = new Server();
