import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { PrismaClient as PrismaClientBrowser } from "@prisma/client";

import { PrismaPostgresService } from "./DbService";
import { DepartureService } from "./DepartureService";
import { MatcherService } from "./MatcherService";
import {
  DepartureList,
  ZtmPlatform,
  ZtmStation,
  ZtmStationWithPlatforms,
} from "../schema";
import { Message, QuickReply } from "./MessengerService";
import { encodeStationAndPlatformToQuickReply } from "../utils";

export class ResponseService {
  query: string;
  prisma: PrismaClientEdge | PrismaClientBrowser;
  constructor(query: string, prisma: PrismaClientEdge | PrismaClientBrowser) {
    this.query = query;
    this.prisma = prisma;
  }

  async getResponseMessage(): Promise<Message> {
    const matcher = new MatcherService(new PrismaPostgresService(this.prisma));
    const departureService = new DepartureService();
    const match = await matcher.match(this.query);

    let responseText = "Not in the system.";
    let quickReplies: QuickReply[] = [];

    if (match.type === "exactMatch") {
      const departures = await departureService.getDepartures(
        match.station,
        match.platform
      );
      responseText = this.parseDeparturesIntoText(
        match.station,
        match.platform,
        departures
      );
      quickReplies = [
        {
          content_type: "text",
          title: "Refresh",
          payload: encodeStationAndPlatformToQuickReply(
            match.station,
            match.platform
          ),
        },
      ];
    }

    if (match.type === "manyStationsFound") {
      responseText = "Choose the station:";
      quickReplies = match.stations.map(({ name, normalizedName }) => ({
        content_type: "text",
        payload: normalizedName,
        title: name,
      }));
    }

    if (match.type === "manyPlatformsFound") {
      const platformsInSipTw = match.platforms.filter(
        ({ isInSipTw }) => isInSipTw
      );

      if (platformsInSipTw.length) {
        responseText = `Station: ${match.station.name}. Choose the platform:`;
        quickReplies = platformsInSipTw.map((platform) => ({
          content_type: "text",
          payload: encodeStationAndPlatformToQuickReply(
            match.station,
            platform
          ),
          title: `${platform.number} (${platform.direction})`,
        }));
      } else {
        responseText = "No platforms on this station are in the system.";
      }
    }

    return {
      text: responseText,
      quick_replies: quickReplies.length ? quickReplies : undefined,
    };
  }

  private parseDeparturesIntoText = (
    station: ZtmStation | ZtmStationWithPlatforms,
    platform: ZtmPlatform,
    departures: DepartureList
  ) => {
    if (departures.type !== "live") {
      return "Not in the system.";
    }
    const firstLine = `Departures for ${station.name} ${platform.number}:`;
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
