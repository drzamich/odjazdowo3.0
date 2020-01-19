import { IZtmStation, IStation } from '../schema';
import { ZtmStation } from '../../schema';

export interface IDbService {
  getAllStations(): Promise<ZtmStation[]>;
  getStationById(id: string): Promise<IStation[]>;
  saveStations(station: IZtmStation[]): Promise<boolean>;
  deleteAllStations(): Promise<boolean>;
}
