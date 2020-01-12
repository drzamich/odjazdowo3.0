import { injectable, inject } from 'inversify';

import { IWebFetchSerivce, IRealTimeDepartureService, IDepartureList } from '../interface';
import { TYPES } from '../IoC/types';
import { LiveDeparture } from '../schema/LiveDeparture';
import { DepartureList } from '../schema/DepartureList';

interface PlatformDto {
  StopId: string;
}

interface DepartureDto {
  Line: string;
  Destination: string;
  Arrival: number;
}

@injectable()
export class SipTwService implements IRealTimeDepartureService {
  private userCode = 'WWW';

  private apiKey = '3aAhqA2/*RWsmvy}P8AsxgtFZ';

  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
  ) {}

  async getPlatformsList(): Promise<string[]> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetStops?userCode=${this.userCode}&userApiKey=${this.apiKey}`;
    const list = await this.webFetchService.get<PlatformDto[]>(url);
    return list.map(val => val.StopId);
  }

  async getDeparturesForPlatform(platformId: string): Promise<IDepartureList> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetLatestPanelPredictions?userCode=${this.userCode}&userApiKey=${this.apiKey}&stopId=${platformId}`;
    const departuresFromApi = await this.webFetchService.get<DepartureDto[]>(url);
    const departures = departuresFromApi.map(departureFromApi => {
      return new LiveDeparture(
        departureFromApi.Line,
        departureFromApi.Destination,
        departureFromApi.Arrival,
      );
    });
    return new DepartureList('live', departures);
  }
}
