import { injectable } from 'inversify';

import { IDbService } from '../interface/service';
import { IZtmStation, ZtmStationModel } from '../interface';
import { ZtmStation } from '../schema';
import { ZtmPlatform } from '../schema/ztm/ZtmPlatform';


@injectable()
export class DbService implements IDbService {
  saveStations(stations: IZtmStation[]): void {
    ZtmStationModel.insertMany(stations, (error, docs) => {
      if (error) {
        console.log('Could not save stations in the database');
        return;
      }
      console.log(`Successfully saved ${docs.length} stations to the database.`);
    });
  }

  async getAllStations(): Promise<ZtmStation[]> {
    const stationsFromDb = await ZtmStationModel.find({});
    return this.parseStations(stationsFromDb);
  }

  async getStationById(ztmId: string): Promise<ZtmStation[]> {
    const stationFromDb = await ZtmStationModel.find({ ztmId }) as IZtmStation[];
    return this.parseStations(stationFromDb);
  }

  deleteAllStations(): void {
    ZtmStationModel.deleteMany({}, () => {
      console.log('Deleted all stations.');
    });
  }

  private parseStations = (stationsFromDb: IZtmStation[]): IZtmStation[] => {
    return stationsFromDb.map(station => {
      const platforms = station.platforms.map(pl => new ZtmPlatform(pl.plNumber, pl.direction, pl.url, pl.isInSipTw));
      return new ZtmStation(station.ztmId, station.name, station.url, platforms);
    });
  };
}
