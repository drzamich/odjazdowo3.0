import { DepartureList, ZtmPlatform, ZtmStationWithPlatforms } from "../schema";
import { SipTwService } from "./SipTwService";

export class DepartureSevice {
  private sipTwService: SipTwService;

  constructor() {
    this.sipTwService = new SipTwService();
  }
  async getDepartures(
    station: ZtmStationWithPlatforms,
    platform: ZtmPlatform
  ): Promise<DepartureList> {
    const platformId = `${station.ztmId}${platform.number}`;
    if (platform.isInSipTw) {
      return this.sipTwService.getDeparturesForPlatform(platformId);
    }
    return { type: "notInSystem" };
  }
}
