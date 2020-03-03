import { IDepartureList, IDeparture } from '../interface';

export class DepartureList implements IDepartureList {
  constructor(
    public type: 'live' | 'timetable' | 'notInSystem' | 'error',
    public departures: IDeparture[],
  ) {}

  getCombinedText(): string {
    const lines = this.departures.map(departure => {
      const { line, direction } = departure;
      const minutes = departure.getMinutesToDeparture();
      return `${line} | ${direction} | ${minutes}`;
    });
    return lines.join('\n');
  }
}
