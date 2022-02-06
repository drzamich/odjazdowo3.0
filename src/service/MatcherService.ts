import { ZtmPlatform, ZtmStation, ZtmStationWithPlatforms } from "../schema";
import { DbService, PrismaPostgresService } from "./DbService";

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
  dbService: DbService;

  constructor() {
    this.dbService = new PrismaPostgresService();
  }

  async matchStationsAndPlatforms(query: string): Promise<MatcherResponse> {
    let stations: ZtmStationWithPlatforms[] = await this.matchStations(query);
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

  async matchStations(query: string): Promise<ZtmStationWithPlatforms[]> {
    if (query === "") return [];
    const foundStations = await this.dbService.findStationsByName(query);
    if (foundStations.length === 1) return foundStations;
    else if (foundStations.length > 1) {
      return this.chooseBestOfBest(query, foundStations);
    } else {
      const queryWithoutLastWord = this.trimLastWord(query);
      return await this.matchStations(queryWithoutLastWord);
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
    const queryWithoutLastWord = this.trimLastWord(query);
    for (const station of stations) {
      if (query === station.normalizedName) return [station];
    }
    for (const station of stations) {
      if (queryWithoutLastWord === station.normalizedName) return [station];
    }
    return stations;
  }

  private trimLastWord(query: string) {
    return query.split(" ").slice(undefined, -1).join(" ");
  }
}
