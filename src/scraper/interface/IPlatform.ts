import IDeparture from './IDeparture';

export default interface IPlatform {
  stationId: number;
  plNumber: number;
  direction: string;
  isInSipTw: boolean;
  departures: IDeparture[];
}
