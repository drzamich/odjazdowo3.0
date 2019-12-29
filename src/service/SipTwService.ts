import { injectable, inject } from 'inversify';

import { IWebFetchSerivce, IRealTimeDepartureService, IDeparture } from '../interface';
import { TYPES } from '../IoC/types';
import { Departure } from '../schema';

interface Dto {
  StopId: string;
}

@injectable()
export class SipTwService implements IRealTimeDepartureService {
  private stopListUrl = 'https://public-sip-api.tw.waw.pl/api/GetStops?userCode=WWW&userApiKey=3aAhqA2/*RWsmvy}P8AsxgtFZ';

  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
  ) {}

  async getPlatformsList(): Promise<string[]> {
    const list = await this.webFetchService.get<Dto[]>(this.stopListUrl);
    return list.map(val => val.StopId);
  }

  async getDepartures(platformId: string): Promise<IDeparture[]> {
    return [new Departure('10', 'Heaven', new Date())];
  }
}
