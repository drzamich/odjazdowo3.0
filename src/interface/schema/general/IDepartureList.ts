import { IDeparture } from './IDeparture';

export interface IDepartureList {
  type: 'live' | 'timetable' | 'notInSystem' | 'error';
  departures: IDeparture[];
  getCombinedText(): string;
}
