
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';

import wtpAggregatePage from './mocks/wtpAggregatePage';
import wtpPlatformPage from './mocks/wtpStationPage';
import { ZtmScrapeService, WebParseService } from '../service';
import { IWebFetchSerivce, IZtmStation, IRealTimeDepartureService } from '../interface';
import { ZtmStation, LiveDeparture, DepartureList } from '../schema';

class AxiosMock implements IWebFetchSerivce {
  async get<T>(url: string): Promise<T> {
    if (url.includes('wtp_dy')) {
      return wtpPlatformPage as unknown as T;
    }
    return wtpAggregatePage as unknown as T;
  }
}

class SipTwServiceMock implements IRealTimeDepartureService {
  async getPlatformsList(): Promise<string[]> {
    return ['709901', '709904'];
  }

  async getDeparturesForPlatform(): Promise<DepartureList> {
    return new DepartureList('live', [new LiveDeparture('10', 'Foo', 10)]);
  }
}

const axiosMock = new AxiosMock();
const webParseService = new WebParseService();
const sipServiceMock = new SipTwServiceMock();
const ztmScrapeService = new ZtmScrapeService(axiosMock, webParseService, sipServiceMock);

describe(`${ZtmScrapeService.name}#getEmptyStations`, () => {
  it('generates an empty station list of proper length', async () => {
    // given
    // when
    const emptyStationList = await ztmScrapeService.getEmptyStations();
    // then
    expect(emptyStationList).toHaveLength(1507);
  });

  it('stations at different positions have proper names', async () => {
    // given
    // when
    const stationList = await ztmScrapeService.getEmptyStations();
    // then
    expect(stationList[0].name).toEqual('1 Sierpnia');
    expect(stationList[0].normalizedName).toEqual('1 sierpnia');
    expect(stationList[88].name).toEqual('Bieżuńska');
    expect(stationList[88].normalizedName).toEqual('biezunska');
    expect(stationList[987].name).toEqual('Powązki-Cm.Wojskowy');
    expect(stationList[987].normalizedName).toEqual('powazki cm wojskowy');
    expect(stationList[1066].name).toEqual('rondo "Radosława"');
    expect(stationList[1066].normalizedName).toEqual('rondo radoslawa');
    expect(stationList[1239].name).toEqual('Świątynia Opatrzności Bożej');
    expect(stationList[1239].normalizedName).toEqual('swiatynia opatrznosci bozej');
    expect(stationList[1481].name).toEqual('Zbójnogórska');
    expect(stationList[1481].normalizedName).toEqual('zbojnogorska');
    expect(stationList[1506].name).toEqual('Żywiecka');
    expect(stationList[1506].normalizedName).toEqual('zywiecka');
    expect(stationList[1507]).not.toBeDefined();
  });

  it('stations have proper IDs', async () => {
    // given
    const expectedStationsWithIds = [
      {
        name: 'Żywiecka',
        ztmId: '4237',
      },
      {
        name: 'Centrum Targowe',
        ztmId: '3119',
      },
      {
        name: 'Osiedle',
        ztmId: '1422',
      },
      {
        name: 'Łazienki Królewskie',
        ztmId: '7095',
      },
    ];
    // when
    const stationList = await ztmScrapeService.getEmptyStations();
    // then
    expectedStationsWithIds.forEach(mockedStation => {
      const stationFromList = stationList.find(station => station.name === mockedStation.name) as IZtmStation;
      expect(stationFromList.ztmId).toEqual(mockedStation.ztmId);
    });
  });
});

describe(`${ZtmScrapeService.name}#getPlatforms`, () => {
  const mockedStation = new ZtmStation('7099',
    'Metro Ratusz-Arsenał',
    'https://www.wtp.waw.pl/rozklady-jazdy/?wtp_md=4&wtp_dt=2019-12-18&wtp_dy=1&wtp_st=7099');

  it('generates list of platforms of proper length', async () => {
    // given
    // when
    const stationWithPlatforms = await ztmScrapeService.getPlatforms([mockedStation]);
    const { platforms } = stationWithPlatforms[0];
    // then
    expect(platforms.length).toEqual(6);
  });

  it('platforms have proper numbers, directions and urls', async () => {
    // given
    // when
    const stationWithPlatforms: IZtmStation[] = await ztmScrapeService.getPlatforms([mockedStation]);
    const { platforms } = stationWithPlatforms[0];
    // then
    expect(platforms[0].direction).toEqual('pl.Bankowy');
    expect(platforms[0].plNumber).toEqual('01');
    expect(platforms[0].url).toEqual('https://www.wtp.waw.pl/rozklady-jazdy/?wtp_md=8&wtp_dt=2019-12-18&wtp_st=7099&wtp_dy=1&wtp_pt=01');
    expect(platforms[0].isInSipTw).toBeTruthy();

    expect(platforms[5].direction).toEqual('Kino Femina');
    expect(platforms[5].plNumber).toEqual('10');
    expect(platforms[5].url).toEqual('https://www.wtp.waw.pl/rozklady-jazdy/?wtp_md=8&wtp_dt=2019-12-18&wtp_st=7099&wtp_dy=1&wtp_pt=10');
    expect(platforms[5].isInSipTw).toBeFalsy();
  });
});
