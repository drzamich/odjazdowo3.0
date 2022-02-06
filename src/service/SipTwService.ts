import { DepartureList, Departure } from "../schema";
import { HttpService } from "./HttpService";

interface PlatformDto {
  StopId: string;
}

interface DepartureDto {
  Line: string;
  Destination: string;
  Arrival: number;
}

export class SipTwService {
  private userCode = "WWW";

  private apiKey = "3aAhqA2/*RWsmvy}P8AsxgtFZ";

  httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async getPlatformsList(): Promise<string[]> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetStops?userCode=${this.userCode}&userApiKey=${this.apiKey}`;
    const platformsFromApi = await this.httpService.get<PlatformDto[]>(url);
    return platformsFromApi ? platformsFromApi.map(({ StopId }) => StopId) : [];
  }

  async getDeparturesForPlatform(platformId: string): Promise<DepartureList> {
    const url = `https://public-sip-api.tw.waw.pl/api/GetLatestPanelPredictions?userCode=${this.userCode}&userApiKey=${this.apiKey}&stopId=${platformId}`;
    const departuresFromApi = await this.httpService.get<DepartureDto[]>(url);
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
