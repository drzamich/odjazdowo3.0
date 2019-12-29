import { injectable } from 'inversify';

import { IDbService } from '../interface/service';
import { IZtmStation, ZtmStationModel } from '../interface';
import { ZtmStation } from '../schema';

@injectable()
export class DbService implements IDbService {
  saveZtmStations(stations: IZtmStation[]): void {
    ZtmStationModel.insertMany(stations, (error, docs) => {
      if (error) {
        console.log('Could not save stations in the database');
        return;
      }
      console.log(`Successfully saved ${docs.length} stations to the database.`);
    });
  }

  async getZtmStations(): Promise<ZtmStation[]> {
    const stations = await ZtmStationModel.find({});
    return stations;
  }

  deleteAllStations(): void {
    ZtmStationModel.deleteMany({}, () => {
      console.log('Deleted all stations.');
    });
  }
}
