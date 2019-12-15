import { IZtmStation } from '../schema';

export interface IDbService {
  saveZtmStation(station: IZtmStation): void;
  // getZtmStations(): IZtmStation[];
  getZtmStations(): void;
  deleteAllStations(): void;
}
