import * as dotenv from 'dotenv';
import { MeasurementController } from './controllers/measurement.controller';
import { EventController } from './controllers/event.controller';
import { OverviewController } from './controllers/overview.controller';
import { UserController } from './controllers/user.controller';
import { Measurement } from './models/measurement.model';
import { Session } from './models/session.model';
import { User } from './models/user.model';
import { ServerService } from './services/server.service';
import { StorageService } from './services/storage.service';
import { Event } from './models/event.model';
import { NotificationService } from './services/notification.service';
import { AverageService } from './services/average.service';
import { EventService } from './services/event.service';
import { Token } from './models/token.model';
import { TokenService } from './services/token.service';

export class Server {

    private _server: ServerService;
    private _storage: StorageService;
    private _port: number;

    constructor() {

        dotenv.config();

        this._port = Number.parseInt(process.env.PORT, 10) || 3001;

        this._server = new ServerService([
            new MeasurementController(),
            new UserController(),
            new OverviewController(),
            new EventController()
        ]);
        this._storage = new StorageService([
            Measurement.initialize,
            User.initialize,
            Session.initialize,
            Event.initialize,
            Token.initialize
        ]);

        this._server.listen(this._port, () => console.log(`server listening at http://localhost:${this._port}`));

        console.log('sending message');
        // NotificationService.send({message: 'Hallo\n Welt', number: '0786447590', flash: false});
       

    }
}

const server = new Server();
