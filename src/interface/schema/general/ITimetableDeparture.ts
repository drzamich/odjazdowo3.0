import { IDeparture } from './IDeparture';

export interface IIimetableDeparture extends IDeparture {
  departureDate: Date;
  getMinutesToDeparture(): number;
}
