import * as dotenv from 'dotenv';
import { MeasurementController } from './controllers/measurement.controller';
import { OverviewController } from './controllers/overview.controller';
import { UserController } from './controllers/user.controller';
import { Measurement } from './models/measurement.model';
import { User } from './models/user.model';
import { ServerService } from './services/server.service';
import { StorageService } from './services/storage.service';

export class Server {

    private _server: ServerService;
    private _storage: StorageService;
    private _port: number;

    constructor() {

        dotenv.config();
        this._port = Number.parseInt(process.env.PORT, 10) || 3001;

        this._server = new ServerService([new MeasurementController(), new UserController(), new OverviewController()]);
        this._storage = new StorageService([Measurement.initialize, User.initialize]);

        this._server.listen(this._port, () => console.log(`server listening at http://localhost:${this._port}`));
    }
}

const server = new Server();
