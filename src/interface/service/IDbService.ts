import { IZtmStation } from '../schema';
import { ZtmStation } from '../../schema';

export interface IDbService {
  saveStations(station: IZtmStation[]): void;
  getAllStationNames(): Promise<any[]>;
  getStations(normalizedName: string): Promise<ZtmStation[]>;
  deleteAllStations(): void;
}
