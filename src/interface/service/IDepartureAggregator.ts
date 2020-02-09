import { IStation, IPlatform, IDepartureList } from '../schema';

export interface IDepartureAggregator {
  getDepartures(station: IStation, platform: IPlatform): Promise<IDepartureList>;
}
