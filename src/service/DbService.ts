import { injectable } from 'inversify';

import { IDbService } from '../interface/service';
import { IZtmStation, ZtmStationModel } from '../interface';
import { ZtmStation } from '../schema';

@injectable()
export class DbService implements IDbService {
  saveZtmStation(station: IZtmStation): void {
    const { ztmId, name, url } = station;
    const stationDb = new ZtmStationModel({ ztmId, name, url });
    stationDb.save().then(() => {
      console.log(`Successfully saved ${name} station to the database.`);
    });
  }

  async getZtmStations(): Promise<ZtmStation[]> {
    const stations = await ZtmStationModel.find({});
    return stations.map(({ name, ztmId, url }) => new ZtmStation(ztmId, name, url));
  }

  deleteAllStations(): void {
    ZtmStationModel.deleteMany({}, () => {
      console.log('Deleted all stations.');
    });
  }
}
