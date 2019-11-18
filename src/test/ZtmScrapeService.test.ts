import 'reflect-metadata';

import wtpAggregatePage from './mocks/wtpAggregatePage';
import wtpPlatformPage from './mocks/wtpStationPage';
import { ZtmScrapeService, WebParseService } from '../service';
import { IWebFetchSerivce } from '../interface';

class AxiosMock implements IWebFetchSerivce {
  async get<T>(url: string): Promise<T> {
    if (url) {
      return wtpAggregatePage as unknown as T;
    }
    return wtpPlatformPage as unknown as T;
  }
}

const axiosMock = new AxiosMock();
const webParseService = new WebParseService();
const ztmScrapeService = new ZtmScrapeService(axiosMock, webParseService);

describe(ZtmScrapeService.name, () => {
  it('generates station list of proper length', async () => {
    const emptyStationList = await ztmScrapeService.scapeTimetable();
    expect(emptyStationList).toHaveLength(1507);
  });
});
