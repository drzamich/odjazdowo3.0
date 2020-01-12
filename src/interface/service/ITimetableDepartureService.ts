import { IDepartureService } from './IDepartureService';
import { IPlatform, IDepartureList } from '../schema';

export interface ITimetableDepartureService extends IDepartureService {
  scrapeDepartures(platform: IPlatform): Promise<IDepartureList>;
}
