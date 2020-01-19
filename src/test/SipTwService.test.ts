
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';

import Axios from 'axios';
import { IWebFetchSerivce } from '../interface';
import { SipTwService } from '../service';
import liveDepartureResponse from './mocks/liveDepartureResponse';
import liveDeparturePlatformList from './mocks/liveDeparturePlatformList';

class AxiosMock implements IWebFetchSerivce {
  async get<T>(url: string): Promise<T> {
    if (url.includes('GetLatestPanelPredictions')) {
      return liveDepartureResponse as unknown as T;
    } if (url.includes('GetStops')) {
      return liveDeparturePlatformList as unknown as T;
    }
    return null as unknown as T;
  }
}

class FailedAxiosMock implements IWebFetchSerivce {
  async get<T>(): Promise<T> {
    return null as unknown as T;
  }
}

describe(`${SipTwService.name}#getPlatformsList`, () => {
  it('generates list of proper length for succesful request', async () => {
    // given
    const webFetchService = new AxiosMock();
    const sipTwService = new SipTwService(webFetchService);
    // when
    const platformsList = await sipTwService.getPlatformsList();
    // then
    expect(platformsList).toHaveLength(576);
  });

  it('generates empty list for failed request', async () => {
    // given
    const webFetchService = new FailedAxiosMock();
    const sipTwService = new SipTwService(webFetchService);
    // when
    const platformsList = await sipTwService.getPlatformsList();
    // then
    expect(platformsList).toHaveLength(0);
  });
});

describe(`${SipTwService.name}#getDeparturesForPlatform`, () => {
  it('generates DepartureList with a proper numer of departures', async () => {
    // given
    const webFetchService = new AxiosMock();
    const sipTwService = new SipTwService(webFetchService);
    // when
    const departureList = await sipTwService.getDeparturesForPlatform('1000');
    // then
    expect(departureList.departures).toHaveLength(4);
  });

  it('generates DepartureList with empty departure list for failed request', async () => {
    // given
    const webFetchService = new FailedAxiosMock();
    const sipTwService = new SipTwService(webFetchService);
    // when
    const departureList = await sipTwService.getDeparturesForPlatform('1000');
    // then
    expect(departureList.departures).toHaveLength(0);
  });
});
