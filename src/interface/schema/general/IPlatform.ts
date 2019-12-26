import { IDeparture } from './IDeparture';

export interface IPlatform {
  plNumber: string;
  direction: string;
  departures: IDeparture[];
}
