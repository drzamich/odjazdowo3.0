import { IDepartureService } from './IDepartureService';

export interface ILiveDepartureService extends IDepartureService {
  getPlatformsList(): Promise<string[]>;
}
