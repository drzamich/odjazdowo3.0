import { IDepartureList } from '../schema';

export interface IDepartureService {
  getDeparturesForPlatform(platformId: string): Promise<IDepartureList>;
}
