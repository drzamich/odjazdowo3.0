import { Prisma, PrismaClient } from "@prisma/client";
import { removeBrand } from "../utils";
import {
  ZtmPlatform,
  ZtmStation,
  ZtmStationWithPlatforms,
  TableItem,
  TableName,
  addBrand,
  Brand,
} from "../schema";

export type DbService = {
  getAll(table: TableName): Promise<(ZtmStation | ZtmPlatform)[]>;
  getStationById(id: string): Promise<ZtmStation | null>;
  findStationsByName(name: string): Promise<ZtmStationWithPlatforms[]>;
  save(items: (ZtmStation | ZtmPlatform)[]): Promise<boolean>;
  deleteAll(table: TableName): Promise<boolean>;
  disconnect(): void;
};

export class PrismaPostgresService implements DbService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  disconnect(): void {
    this.prisma.$disconnect();
  }

  async save(items: TableItem[]): Promise<boolean> {
    let savedItems: Prisma.BatchPayload;
    const tableName = items[0].__brand;
    const itemsWithoutBrand = items.map(removeBrand);
    if (tableName === Brand.platform) {
      savedItems = await this.prisma.platform.createMany({
        data: itemsWithoutBrand as ZtmPlatform[],
      });
    } else {
      savedItems = await this.prisma.station.createMany({
        data: itemsWithoutBrand as ZtmStation[],
      });
    }
    if (savedItems.count) {
      console.log(
        `Succesfully saved ${savedItems.count} ${tableName}s to the database.`
      );
    } else {
      console.log(`Error when saving ${tableName}s to the database.`);
    }
    return Boolean(savedItems.count);
  }

  async getAll(table: TableName): Promise<TableItem[]> {
    if (table === Brand.platform) {
      return (await this.prisma.platform.findMany()).map((e) =>
        addBrand(e, Brand.platform)
      );
    } else {
      return (await this.prisma.station.findMany()).map((e) =>
        addBrand(e, Brand.station)
      );
    }
  }

  async getStationById(ztmId: string): Promise<ZtmStation | null> {
    const stationFromDB = await this.prisma.station.findFirst({
      where: { ztmId },
    });
    return addBrand(stationFromDB!, Brand.station);
  }

  async findStationsByName(name: string): Promise<ZtmStationWithPlatforms[]> {
    const sanitizedName = name.split(" ").join(" & ");

    try {
      const stations = await this.prisma.station.findMany({
        where: {
          normalizedName: {
            search: sanitizedName,
          },
        },
        include: {
          Platform: true,
        },
      });
      return stations.map((station) => ({
        ...station,
        platforms: station.Platform.map((e) => addBrand(e, Brand.platform)),
        __brand: Brand.stationWithPlatforms,
      }));
    } catch (e) {
      console.error(e);
      console.error(`Error finding station of name ${name}`);
      return [];
    }
  }

  async deleteAll(table: TableName): Promise<boolean> {
    try {
      let deleteQuery: Prisma.BatchPayload;
      if (table === "platform") {
        deleteQuery = await this.prisma.platform.deleteMany({});
      } else {
        deleteQuery = await this.prisma.station.deleteMany({});
      }
      const deleteCount = deleteQuery.count;
      console.log(`Removed ${deleteCount} ${table}s from the database.`);
      return true;
    } catch (e) {
      console.warn(e);
      console.log(`Could not remove ${table}s from the database.`);
      return false;
    }
  }

  // private parseStations = (stationsFromDb: Station[]): Station[] => {
  //   return stationsFromDb.map((station) => {
  //     const platforms = station.platforms.map(
  //       (pl) => new ZtmPlatform(pl.plNumber, pl.direction, pl.url, pl.isInSipTw)
  //     );
  //     return new Station(station.ztmId, station.name, station.url, platforms);
  //   });
  // };
}
