import { injectable } from 'inversify';

import { IDbService } from '../interface/service';
import { IZtmStation, ZtmStationModel } from '../interface';
import { ZtmStation } from '../schema';

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

  async getStations(normalizedName: string): Promise<ZtmStation[]> {
    let stations: ZtmStation[] = [];
    if (normalizedName === 'all') {
      stations = await ZtmStationModel.find({});
    } else {
      stations = await ZtmStationModel.find({ normalizedName });
    }
    return stations;
  }

  async getAllStationNames(): Promise<any[]> {
    return ZtmStationModel.find({}, 'normalizedName');
  }

  deleteAllStations(): void {
    ZtmStationModel.deleteMany({}, () => {
      console.log('Deleted all stations.');
    });
  }
}
