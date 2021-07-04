import { MeasurementAttributes } from '../models/measurement.model';

export class AverageService {

    private duration = Number.parseInt(process.env.AVERAGE_DURATION, 10);
    private granularity = Number.parseInt(process.env.AVERAGE_GRANULARITY, 10);
    private window = Number.parseInt(process.env.AVERAGE_WINDOW, 10);



    average(all: MeasurementAttributes[]): { avgUsage: number, stde: number } {
        console.log(this.duration, this.granularity, this.window);
        const max = this.max(all, d => d.timestamp);
        const currentInterval = this.getInterval(max) - 1;
        const relevantData = all
            .map(a => ({ wh: a.wh, timestamp: a.timestamp, interval: this.getInterval(a.timestamp) }))
            .filter(a => a.interval === currentInterval);

        const avg = relevantData.reduce((acc, curr) => acc += curr.wh, 0) / relevantData.length;
        const stde = Math.sqrt(relevantData.reduce((acc, curr) => acc += Math.pow((curr.wh - avg), 2), 0) / relevantData.length);

        const numBuckets = Array.from(relevantData
            .sort((a, b) => a.timestamp - b.timestamp)
            .reduce((acc, curr) => {
                const currDate = new Date(curr.timestamp);
                acc.set(currDate.toDateString(), currDate.toDateString());
                return acc;
            },
                new Map<string, string>()).keys()
        ).length;
        const avgUsage = relevantData.reduce((acc, curr) => acc += curr.wh, 0) / numBuckets;

        return { avgUsage, stde };
    }



    getDateFromInterval(interval: number, max: number) {
        return this.getStartOfWindow(max) + ((interval) * this.granularity);
    }

    getInterval(ts: number) {
        return (this.currentInterval(ts) - this.getStartOfWindow(ts)) / this.granularity;
    }
    currentInterval(ts: number) {
        return ts - (ts % this.granularity);
    }

    getStartOfWindow(ts: number) {
        return ts - (ts % this.window);
    }

    getStartOfPreviousDuration(ts: number) {
        return ts - (ts % this.duration) - this.duration;
    }

    max<T>(data: T[], fn: (d: T) => number) {
        return data.reduce((acc, curr) => acc = acc < fn(curr) ? fn(curr) : acc, 0);
    }

    min<T>(data: T[], fn: (d: T) => number) {
        return data.reduce((acc, curr) => acc = acc > fn(curr) ? fn(curr) : acc, Number.MAX_VALUE);
    }

    getUsage(all: MeasurementAttributes[]): number {
        const max = this.max(all, d => d.timestamp);
        const allred = all
            .filter(a =>
                a.timestamp > this.getStartOfPreviousDuration(max)
                && a.timestamp < this.getStartOfPreviousDuration(max) + this.duration
            );


        return allred.reduce((acc, curr) => acc += curr.wh, 0);
    }


}
