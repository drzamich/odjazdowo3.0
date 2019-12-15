
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';

import wtpAggregatePage from './mocks/wtpAggregatePage';
import wtpPlatformPage from './mocks/wtpStationPage';
import { ZtmScrapeService, WebParseService } from '../service';
import { IWebFetchSerivce, IDbService, IZtmStation } from '../interface';

class AxiosMock implements IWebFetchSerivce {
  async get<T>(url: string): Promise<T> {
    if (url) {
      return wtpAggregatePage as unknown as T;
    }
    return wtpPlatformPage as unknown as T;
  }
}

class DbMock implements IDbService {
  saveZtmStation(station: IZtmStation): void {}

  deleteAllStations(): void{}

  getZtmStations(): void {}
}

const axiosMock = new AxiosMock();
const dbMock = new DbMock();
const webParseService = new WebParseService();
const ztmScrapeService = new ZtmScrapeService(axiosMock, webParseService, dbMock);

describe(ZtmScrapeService.name, () => {
  it('generates station list of proper length', async () => {
    const emptyStationList = await ztmScrapeService.scapeTimetable();
    expect(emptyStationList).toHaveLength(1507);
  });
});
