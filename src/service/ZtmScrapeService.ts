import moment from "moment";
import cheerio from "cheerio";
import { HttpService } from "./HttpService";
import { SipTwService } from "./SipTwService";
import { Brand, ZtmPlatform, ZtmStation } from "../schema";
import { normalizeString } from "../utils";

export class ZtmScrapeService {
  sipTwService: SipTwService;
  httpService: HttpService;

  constructor() {
    this.sipTwService = new SipTwService();
    this.httpService = new HttpService();
  }

  public async getStations() {
    const stations: ZtmStation[] = [];
    try {
      const aggregateUrl = this.generateAggregateUrl();
      console.log(`Fetching list of stations from ${aggregateUrl} ...`);
      const fetchedWebsite = await this.httpService.get(aggregateUrl) as string;
      if (!fetchedWebsite) {
        console.log("Could not fetch list of stations from ZTM.");
        return [];
      }
      console.log("List of stations fetched. Parsing...");
      const $ = cheerio.load(fetchedWebsite);
      const links = $(".timetable-stops-block-body-item a");
      const warsawIdentifier = "(Warszawa)";
      const warsawLinks = links.filter((index, element) =>
        $(element).text().includes(warsawIdentifier)
      );
      warsawLinks.each((index, element) => {
        const item = $(element);
        const url = item.attr("href");
        if (!url) {
          throw new Error("href attr missing");
        }
        const fullName = item.find("span").first().text();
        const name = fullName.split(warsawIdentifier)[0].trim();
        const ztmId = url.split("wtp_st=")[1];
        const normalizedName = normalizeString(name);
        stations.push({
          ztmId,
          name,
          normalizedName,
          url,
          __brand: Brand.Station,
        });
      });

      console.log(
        `List of stations parsed. Number of stations: ${stations.length}`
      );
    } catch (e) {
      console.error(e);
      console.error("Error when fetching stations.");
    }
    return stations;
  }

  public async getPlatforms(emptyStations: ZtmStation[]) {
    const result: ZtmPlatform[] = [];
    try {
      const sipTwIds = await this.sipTwService.getPlatformsList();
      const len = emptyStations.length;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < len; i++) {
        const { name, url, ztmId: ztmStationId } = emptyStations[i];
        console.log(`Fetching platforms for station '${name}' ...`);
        const fetchedWebsite = await this.httpService.get(url) as string;
        if (!fetchedWebsite) {
          console.log(`Could not get platforms for station ${name}`);
          return [];
        }
        const $ = cheerio.load(fetchedWebsite);
        const links = $(".timetable-link");
        links.each((index, element) => {
          const item = $(element);
          if (!url) {
            throw new Error("href attr missing");
          }
          const fullName = item
            .find(".timetable-stop-point-title-name")
            .text()
            .trim()
            .split(" ");
          const plNumber = fullName[fullName.length - 1];
          const sipTwId = `${ztmStationId}${plNumber}`;
          const isInSipTw = sipTwIds.includes(sipTwId);
          const direction = item
            .find(".timetable-stop-point-title-destination")
            .text()
            .trim();
          result.push({
            direction,
            isInSipTw,
            url,
            ztmStationId,
            number: plNumber,
            __brand: Brand.Platform,
          });
        });

        console.log(
          `Platforms for stations '${name}' succesfully fetched and parsed.`
        );
      }
      const success = result.length;
      console.log(`Successfully fetched ${success} platforms.`);
    } catch (e) {
      console.error(e);
      console.error("Error when fetching platforms.");
    }
    return result;
  }

  private generateAggregateUrl(): string {
    const date = moment().format("YYYY-MM-DD");
    return `https://www.wtp.waw.pl/rozklady-jazdy/?wtp_dt=${date}&wtp_md=1`;
  }
}
