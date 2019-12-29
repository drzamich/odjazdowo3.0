import { IDeparture } from '../schema';

export interface IRealTimeDepartureService {
  getPlatformsList(): Promise<string[]>;
  getDepartures(platformId: string): Promise<IDeparture[]>;
}
