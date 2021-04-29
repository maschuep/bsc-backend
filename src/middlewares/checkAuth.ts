import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// this way you can just define a function and export it instead of a whole class
export function verifyToken(req: Request, res: Response, next: any) {
    let token: string;
    try {
        const secret = process.env.JWT_SECRET;
        // since the Authorizationheader consists of "Bearer <token>" where <token> is a JWT token
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        if (decoded == null) {
            console.log(token);
            res.status(403).send({ message: 'Unauthorized' });
        }
        // adds the field "tokenPayload" to the request enabling following functions to use data from the token
        req.body.tokenPayload = decoded;
        next();
    } catch (err) {
        res.status(403).send({ message: 'Unauthorized' });
    }
}

export function authenticateMeasruements(req: Request, res: Response, next: (...args: any[]) => any) {
    let token: string;
    try {
        const secret = process.env.JWT_STATION_SECRET;
        // since the Authorizationheader consists of "Bearer <token>" where <token> is a JWT token
        token = req.headers.authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, secret);
        if (decoded == null) {
            res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.tokenPayload = decoded;
        next();
    } catch (err) {
        res.status(403).send({ message: 'Unauthorized' });
    }
}
