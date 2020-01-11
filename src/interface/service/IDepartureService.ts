import { IDepartureList, IPlatform } from '../schema';

export interface IDepartureService {
  getDepartures(platform: IPlatform): Promise<IDepartureList>;
}
