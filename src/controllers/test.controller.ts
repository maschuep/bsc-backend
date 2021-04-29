import express, { Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controller.interface';

export class TestController implements Controller {

    private _router = express.Router();
    private _path = '/test';

    constructor(router:Router){
        this._router.get('/', this.getTest)
        router.use(this._path, this._router)
    }

    getTest(req: Request, res: Response): Response {
        return res.status(200).send('<h1>Test works</h1>');
    }

    getRouter(): Router{
        return this._router;
    }

}
