import jwt from 'jsonwebtoken';
import { Token as IToken } from '../interfaces/token.interface';
import { Token } from '../models/token.model';

export class TokenService {

    static chars = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
        77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 97, 98, 99, 100, 101, 102, 103, 104,
        105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
        117, 118, 119, 120, 121];

    static create(data: IToken): string {
        const secret = process.env.JWT_SECRET;
        return jwt.sign(
            data,
            secret,
            { expiresIn: '24h' }
        );
    }

    static createSmsToken(data: IToken): string {
        const secret = process.env.JWT_SECRET;
        const signed = jwt.sign(data, secret, { expiresIn: '24h' });
        let tokenId = '';
        for (let i = 0; i < 25; i++) {
            tokenId += String.fromCharCode(TokenService.chars[
                Math.floor(Math.random() * TokenService.chars.length)
            ]);
        }
        Token.create({ token: signed, tokenId });
        return tokenId; // nume token
    }

}
