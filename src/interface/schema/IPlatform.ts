import { IDeparture } from './IDeparture';

export interface IPlatform {
  stationId: number;
  plNumber: number;
  direction: string;
  isInSipTw: boolean;
  departures: IDeparture[];
}
