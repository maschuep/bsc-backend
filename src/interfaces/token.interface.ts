import { SessionAttributes } from '../models/session.model';

export interface Token {
    mail: string;
    participant: string;
    userId: number;
    session: SessionAttributes;
}
