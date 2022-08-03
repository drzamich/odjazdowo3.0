import { ZtmPlatform, ZtmStationWithPlatforms } from "../schema";
import {
  getLastWord,
  isNumeric,
  normalizeString,
  trimLastWord,
} from "../utils";
import { DbService } from "./DbService";

export const MAX_MATCHED_STATIONS = 5;

type MatcherResponse =
  | {
      type: "exactMatch";
      station: ZtmStationWithPlatforms;
      platform: ZtmPlatform;
    }
  | {
      type: "manyStationsFound";
      stations: ZtmStationWithPlatforms[];
    }
  | {
      type: "noStationsFound";
    }
  | {
      type: "manyPlatformsFound" | "noSuchPlatform";
      station: ZtmStationWithPlatforms;
      platforms: ZtmPlatform[];
    };

export class MatcherService {
  constructor(private dbService: DbService) {}

  private async matchStations(
    rawQuery: string
  ): Promise<ZtmStationWithPlatforms[]> {
    if (rawQuery === "") return [];
    let query = rawQuery;
    if (isNumeric(getLastWord(rawQuery))) {
      query = trimLastWord(rawQuery);
    }
    const foundStations = await this.dbService.findStationsByName(query);
    if (foundStations.length === 1) return foundStations;
    else if (foundStations.length > 1) {
      return this.chooseBestOfBest(query, foundStations);
    } else {
      const queryWithoutLastWord = trimLastWord(query);
      return await this.matchStations(queryWithoutLastWord);
    }
  }

  async matchStationsAndPlatforms(rawQuery: string): Promise<MatcherResponse> {
    const query = normalizeString(rawQuery);
    const stations: ZtmStationWithPlatforms[] = await this.matchStations(query);
    if (!stations.length) {
      return { type: "noStationsFound" };
    } else if (stations.length > 1) {
      return {
        type: "manyStationsFound",
        stations: stations.slice(0, MAX_MATCHED_STATIONS),
      };
    } else {
      const platforms = this.matchPlatforms(stations[0], query);
      if (platforms.length > 1) {
        return {
          type: "manyPlatformsFound",
          station: stations[0],
          platforms,
        };
      } else if (!platforms.length) {
        return {
          type: "noSuchPlatform",
          station: stations[0],
          platforms,
        };
      } else {
        return {
          type: "exactMatch",
          station: stations[0],
          platform: platforms[0],
        };
      }
    }
  }

  private matchPlatforms(
    station: ZtmStationWithPlatforms,
    query: string
  ): ZtmPlatform[] {
    const lastWordOfQuery = query.split(" ").slice(-1);
    const parsedLastWord = Number(lastWordOfQuery).toString().padStart(2, "0");
    const matchingPlatform = station.platforms.find(
      (platform) => platform.number === parsedLastWord
    );
    return matchingPlatform ? [matchingPlatform] : station.platforms;
  }

  private chooseBestOfBest(
    query: string,
    stations: ZtmStationWithPlatforms[]
  ): ZtmStationWithPlatforms[] {
    const queryWithoutLastWord = trimLastWord(query);
    for (const station of stations) {
      if (query === station.normalizedName) return [station];
    }
    for (const station of stations) {
      if (queryWithoutLastWord === station.normalizedName) return [station];
    }
    return stations;
  }
}
