import jwt from 'jsonwebtoken';
import { Token } from '../interfaces/token.interface';

export class TokenService {

    static create(data: Token): string {
        const secret = process.env.JWT_SECRET;
        return jwt.sign(
            data,
            secret,
            { expiresIn: '24h' }
        );
    }

}
