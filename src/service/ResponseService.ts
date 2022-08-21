import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { PrismaClient as PrismaClientBrowser } from "@prisma/client";

import { PrismaPostgresService } from "./DbService";
import { DepartureService } from "./DepartureService";
import { MatcherService } from "./MatcherService";
import { DepartureList, ZtmPlatform, ZtmStationWithPlatforms } from "../schema";

export class ResponseService {
  query: string;
  prisma: PrismaClientEdge | PrismaClientBrowser;
  constructor(query: string, prisma: PrismaClientEdge | PrismaClientBrowser) {
    this.query = query;
    this.prisma = prisma;
  }

  async getResponse() {
    const matcher = new MatcherService(new PrismaPostgresService(this.prisma));
    const departureService = new DepartureService();
    const match = await matcher.matchStationsAndPlatforms(this.query);

    if (match.type === "exactMatch") {
      const departures = await departureService.getDepartures(
        match.station,
        match.platform
      );
      return this.parseDeparturesIntoText(
        match.station,
        match.platform,
        departures
      );
    }

    return "Not available";
  }

  private parseDeparturesIntoText = (
    station: ZtmStationWithPlatforms,
    platform: ZtmPlatform,
    departures: DepartureList
  ) => {
    if (departures.type !== "live") {
      return "Not available";
    }
    const firstLine = `Departures for ${station.name} ${platform.number}`;
    const otherLines = departures.departures
      .map(
        ({ line, direction, minutesLeft }) =>
          `${line} | ${direction} | ${minutesLeft}`
      )
      .map((line, index, arr) =>
        index === arr.length - 1 ? line : `${line}\n`
      )
      .join("");
    return `${firstLine}\n${otherLines}`;
  };
}
