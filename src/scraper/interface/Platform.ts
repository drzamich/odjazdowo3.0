import Departure from './Departure';

export default interface Platform {
  stationId: number,
  plNumber: number,
  direction: string,
  isInSipTw: boolean,
  departures: Departure[],
}