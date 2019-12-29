import { IZtmStation } from '../schema';
import { ZtmStation } from '../../schema';

export interface IDbService {
  saveZtmStations(station: IZtmStation[]): void;
  getZtmStations(): Promise<ZtmStation[]>;
  deleteAllStations(): void;
}
