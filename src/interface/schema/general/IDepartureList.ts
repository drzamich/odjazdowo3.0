import { IDeparture } from './IDeparture';

export interface IDepartureList {
  type: string;
  departures: IDeparture[];
  getCombinedText(): string;
}
