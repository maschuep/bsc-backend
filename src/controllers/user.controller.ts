import express, { Request, Response, Router } from 'express';
import { ControllerFactory } from '../interfaces/controller-factory.interface';
import { ControllersObject } from '../interfaces/controllers-object.interface';
import { User, UserAttributes } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SessionAttributes } from '../models/session.model';
import { Session } from '../models/session.model';
import { verifyToken } from '../middlewares/checkAuth';
import { TokenService } from '../services/token.service';
import { Token } from '../models/token.model';

export class UserController implements ControllerFactory {

    _path: string;
    _router: Router;

    constructor() {
        this._router = express.Router();
        this._path = '/user';
        this.login();
        this.register();
        this.session();
        this.mailExists();
        this.getProfile();
        this.token();
    }

    public getPathAndRouter(): ControllersObject {
        return { path: this._path, controller: this._router };
    }

    public mailExists() {
        this._router.get('/exists/:mail', (req: Request, res: Response) => {
            User.findOne({ where: { mail: req.params.mail } }).then(f => {
                if (f) {
                    res.status(202).send({ message: 'exists' });
                } else {
                    res.status(203).send({ message: 'does not exist' });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send();
            });
        });
    }

    public login() {
        this._router.post('/login', (req: Request, res: Response) => {
            User.findOne({
                where: { mail: req.body.mail }
            }).then(user => {
                if (bcrypt.compareSync(req.body.password, user.password)) {// compares the hash with the password from the lognin request
                    Session
                        .create({ timestamp: Date.now(), userId: user.userId })
                        .then(session =>
                            res.status(200).send({
                                participant: user.participant,
                                mail: user.mail,
                                userId: user.userId,
                                token: TokenService.create({ mail: user.mail, participant: user.participant, userId: user.userId, session })
                            })
                        ).catch(err => res.status(500));
                } else {
                    res.status(403).send({ message: 'not authorized' });
                }
            }
            ).catch(err => {
                console.log(err);
                return res.status(500).send();
            });
        });
    }

    public session() {
        this._router.get('/session', verifyToken, (req, res) => {
            const session = req.body.tokenPayload;
            Session.findOne(session.sessionId)
                .then(s => {
                    s.duration = Date.now();
                    s.save();
                    res.status(200).send();
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        });
    }

    public getProfile() {
        this._router.get('/', verifyToken, (req, res) => {
            User.findByPk(req.body.tokenPayload.userId)
                .then(u => {
                    u.password = '';
                    res.status(200).send(u);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        });
    }

    public updateProfile() {
        this._router.patch('/', verifyToken, (req, res) => {
            User.findByPk(req.body.tokenPayload)
                .then(found => found.update(req.body).then(f => res.status(200).send()))
                .catch(err => {
                    console.log(err);
                    res.status(500).send();
                });
        });
    }

    public token() {
        this._router.get('/token/:tokenId', (req, res) => {
            Token.findByPk(req.params.tokenId)
            .then(f => res.status(200).send(f))
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
        });
    }

    public register() {
        this._router.post('/register', (req, res) => {
            const saltRounds = 12;
            const user: UserAttributes = req.body;
            user.password = bcrypt.hashSync(user.password, saltRounds);
            User.create(user)
                .then(u => {
                    Session.create({ timestamp: Date.now(), userId: u.userId })
                        .then(session => res.status(201).send({ participant: u.participant, token: this.createToken(u, session) }))
                        .catch(err => { console.log(err); res.status(500).send(); });
                })
                .catch(err => res.status(500).send(err));
        });
    }

    private createToken(user: UserAttributes, session: SessionAttributes): string {
        const secret = process.env.JWT_SECRET;
        return jwt.sign(
            { participant: user.participant, mail: user.mail, userId: user.userId, session },
            secret,
            { expiresIn: '2h' }
        );
    }

}
