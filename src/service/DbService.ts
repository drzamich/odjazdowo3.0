import { injectable } from 'inversify';

import { IDbService } from '../interface/service';
import { IZtmStation, ZtmStationModel } from '../interface';
import { ZtmStation } from '../schema';
import { ZtmPlatform } from '../schema/ztm/ZtmPlatform';


@injectable()
export class DbService implements IDbService {
  async saveStations(stations: IZtmStation[]): Promise<boolean> {
    const savedStations = await ZtmStationModel.insertMany(stations);
    if (savedStations.length === stations.length) {
      console.log(`Succesfully saved ${stations.length} stations to the database.`);
      return true;
    }
    console.log('Error when saving stations to the database.');
    return false;
  }

  async getAllStations(): Promise<ZtmStation[]> {
    const stationsFromDb = await ZtmStationModel.find({});
    return this.parseStations(stationsFromDb);
  }

  async getStationById(ztmId: string): Promise<ZtmStation[]> {
    const stationFromDb = await ZtmStationModel.find({ ztmId }) as IZtmStation[];
    return this.parseStations(stationFromDb);
  }

  async deleteAllStations(): Promise<boolean> {
    const deleteQuery = await ZtmStationModel.deleteMany({});
    if (deleteQuery.ok) {
      console.log(`Removed all stations ${deleteQuery.deletedCount} from the database.`);
      return true;
    }
    console.log('Could not remove stations from the database.');
    return false;
  }

  private parseStations = (stationsFromDb: IZtmStation[]): IZtmStation[] => {
    return stationsFromDb.map(station => {
      const platforms = station.platforms.map(pl => new ZtmPlatform(pl.plNumber, pl.direction, pl.url, pl.isInSipTw));
      return new ZtmStation(station.ztmId, station.name, station.url, platforms);
    });
  };
}
