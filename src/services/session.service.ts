import { Session, SessionAttributes } from '../models/session.model';

export class SessionService {

    static trackSession(session: SessionAttributes) {
        Session.findOne({ where: { sessionId: session.sessionId } })
            .then(s => {
                s.timestamp = s.timestamp ? s.timestamp : Date.now();
                s.duration = Date.now();
                s.save();
            })
            .catch(err => {
                console.log(err);
            });
    }
}
