
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { IHttpService } from '../interface';
import { SipTwService } from '../service';
import liveDepartureResponse from './mocks/liveDepartureResponse';
import liveDeparturePlatformList from './mocks/liveDeparturePlatformList';

class AxiosMock implements IHttpService {
  async get<T>(url: string): Promise<T> {
    if (url.includes('GetLatestPanelPredictions')) {
      return liveDepartureResponse as unknown as T;
    } if (url.includes('GetStops')) {
      return liveDeparturePlatformList as unknown as T;
    }
    return null as unknown as T;
  }

  async post(url: string, body: object): Promise<void> {

  }
}

class FailedAxiosMock implements IHttpService {
  async get<T>(): Promise<T> {
    return null as unknown as T;
  }

  async post(url: string, body: object): Promise<void> {

  }
}

describe(`${SipTwService.name}#getPlatformsList`, () => {
  it('generates list of proper length for succesful request', async () => {
    // given
    const httpService = new AxiosMock();
    const sipTwService = new SipTwService(httpService);
    // when
    const platformsList = await sipTwService.getPlatformsList();
    // then
    expect(platformsList).toHaveLength(576);
  });

  it('generates empty list for failed request', async () => {
    // given
    const httpService = new FailedAxiosMock();
    const sipTwService = new SipTwService(httpService);
    // when
    const platformsList = await sipTwService.getPlatformsList();
    // then
    expect(platformsList).toHaveLength(0);
  });
});

describe(`${SipTwService.name}#getDeparturesForPlatform`, () => {
  it('generates DepartureList with a proper numer of departures', async () => {
    // given
    const httpService = new AxiosMock();
    const sipTwService = new SipTwService(httpService);
    // when
    const departureList = await sipTwService.getDeparturesForPlatform('1000');
    // then
    expect(departureList.departures).toHaveLength(4);
  });

  it('generates DepartureList with empty departure list for failed request', async () => {
    // given
    const httpService = new FailedAxiosMock();
    const sipTwService = new SipTwService(httpService);
    // when
    const departureList = await sipTwService.getDeparturesForPlatform('1000');
    // then
    expect(departureList.departures).toHaveLength(0);
  });
});
