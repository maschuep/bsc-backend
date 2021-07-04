import {  MeasurementAttributes } from '../models/measurement.model';
import { AverageService } from './average.service';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { TokenService } from './token.service';
import { Session } from '../models/session.model';

export class EventService {



    static createEventAndNotify(all: MeasurementAttributes[], participant: string) {
        const msg = 'Hallo, Sie hatten vor kurzem einen erhoehten Stromverbrauch. Sie koennen mit dem Link in der Begleitnachricht erfassen was Sie gemacht haben.';
        const shortMsg = 'Klicken Sie hier um den erhöhten Stromverbrauch zu messen:\n';
        const sensitivity = Number.parseInt(process.env.EVENT_SENSITIVITY, 10);


        const backofftimeEvent = Number.parseInt(process.env.EVENT_BACKOFF, 10);
        const backofftimeSMS = Number.parseInt(process.env.SMS_BACKOFF, 10);


        Event.findAll({ where: { participant: participant } })
            .then(f => {

                const avgservice = new AverageService();

                

                const latestEvent = avgservice.max(f, d => d.timestamp);

                const usage = avgservice.getUsage(all);
                const stats = avgservice.average(all);
                const deviation = usage - stats.avgUsage;
                const deviationAndStde = deviation - sensitivity * stats.stde;



                if (latestEvent < Date.now() - backofftimeEvent && usage > sensitivity * stats.avgUsage && deviationAndStde > 0) {

                    const max = avgservice.max(all, d => d.timestamp);
                    Event.create({
                        timestamp: max,
                        participant: participant,
                        average: stats.avgUsage,
                        usage: usage,
                        deviation: stats.stde
                    } as any);

                    User.findAll({ where: { participant: participant } })
                        .then(users => {
                            const timer = 12000;
                            let count = 1;

                            users.forEach(u => {

                                if (/*u.active &&*/ u.lastNotification < Date.now() - backofftimeSMS) {
                                    u.lastNotification = Date.now();
                                    u.save();

                                    // send link Session
                                    // problem is the sending, because the encoding changes
                                    Session.create({ timestamp: Date.now(), userId: u.userId })
                                        .then(session => {
                                            const tokenId = TokenService.createSmsToken({
                                                mail: u.mail,
                                                participant: u.participant,
                                                session,
                                                userId: u.userId
                                            });
                                            setTimeout(() => {
                                                
                                                NotificationService.send({
                                                    message: `${msg}`,
                                                    number: u.phone,
                                                    flash: true
                                                });
                                            }, (timer * count) / 3);
                                            setTimeout(() => {

                                                NotificationService.send({
                                                    message: `${shortMsg}https://strom.maschuep.ch/token/${tokenId}`,
                                                    number: u.phone,
                                                    flash: false
                                                });
                                            }, (timer * count) / 2);
                                            count += 1;
                                        });

                                }
                            });
                        });
                }

            })
            .catch(err => console.log(err));



        // if latest event is < than an hour old dont bother
        // check last 1 hours measured
        // check last 1 hour average
        // if bigger than stde by factor and last notification was more than 48 hours ago, send notification.
        // differentiate between event generation and notification
        // granularity: 60 mins only make event if no event in last 60 mins
    }

}
