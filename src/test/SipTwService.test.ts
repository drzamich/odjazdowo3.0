
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';

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

const axiosMock = new AxiosMock();
const sipTwService = new SipTwService(axiosMock);

describe(`${SipTwService.name}#getPlatformsList`, () => {
  it('generates list of proper length', async () => {
    // given
    // when
    const platformsList = await sipTwService.getPlatformsList();
    // then
    expect(platformsList).toHaveLength(576);
  });
});

describe(`${SipTwService.name}#getDeparturesForPlatform`, () => {
  it('generates DepartureList with a proper numer of departures', async () => {
    // given
    // when
    const departureList = await sipTwService.getDeparturesForPlatform('1000');
    // then
    expect(departureList.departures).toHaveLength(4);
  });
});
