import { DepartureList, Departure } from "../schema";
import { HttpService } from "./HttpService";

type PlatformDto = {
  StopId: string;
};

type DepartureDto = {
  Line: string;
  Destination: string;
  Arrival: number;
};

export class SipTwService {
  httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getPlatformsList(): Promise<string[]> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetStops?userCode=WWW&userApiKey=${SIP_TW_API_KEY}`;
    const platformsFromApi = (await this.httpService.get(url)) as PlatformDto[];
    return platformsFromApi ? platformsFromApi.map(({ StopId }) => StopId) : [];
  }

  async getDeparturesForPlatform(platformId: string): Promise<DepartureList> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetLatestPanelPredictions?userCode=WWW&userApiKey=${SIP_TW_API_KEY}&stopId=${platformId}`;
    const departuresFromApi = (await this.httpService.get(
      url
    )) as DepartureDto[];
    if (!departuresFromApi) return { type: "error" };
    const departures: Departure[] = departuresFromApi.map((dep) => ({
      line: dep.Line,
      direction: dep.Destination,
      minutesLeft: dep.Arrival,
    }));
    return {
      type: "live",
      departures,
    };
  }
}
