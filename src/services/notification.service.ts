import http from 'http';
import { Message } from '../interfaces/message.interface';
export class NotificationService {

    static send(msg: Message) {
        const url = process.env.SMS_URL;
        const token = process.env.SMS_TOKEN;
        const data: string = JSON.stringify({ message: msg.message, number: msg.number, flash: msg.flash });
        console.log(data);
        const options = {
            hostname: url,
            port: 80,
            path: '/sms/send',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Length': data.length,
                'Content-Type': 'application/json',
                'encoding': 'text/html;charset=\'charset=utf-8\''
            }
        };

        const req = http.request(options, (res: any) => {
            console.log(`statusCode: ${res.statusCode}`);
        });


        req.on('error', (err: any) => console.log(err));
        req.write(data);
        req.end();


    }

}
