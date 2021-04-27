import express, { Application } from 'express';
import morgan from 'morgan';
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';


export class Server {
    private server: Application;
    private sequelize: Sequelize;
    private port = process.env.PORT || 3001;

    constructor() {

        dotenv.config();

        this.server = this.configureServer();
        this.sequelize = this.configureSequelize();

        this.sequelize.sync()
        .then(() => {                           // create connection to the database
            this.server.listen(this.port, () => {                                   // start server on specified port
                console.log(`server listening at http://localhost:${this.port}`);   // indicate that the server has started
            });
        })
        .catch(err =>
            console.log(err)
        );
    }

    private configureServer(): Application {
        return express()
            .use(express.json())                    // parses an incoming json to an object
            .use(morgan('tiny'))                    // logs incoming requests
            .get('/', (req, res) => res.send('<h1>Backend is running<span style="font-size:50px">&#127881;</span></h1>'));
    }

    private configureSequelize(): Sequelize {
        return new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite',
            logging: false // can be set to true for debugging
        });
    }
}

const server = new Server(); // starts the server
