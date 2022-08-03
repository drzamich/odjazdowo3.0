import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { Prisma, PrismaClient as PrismaClientBrowser } from "@prisma/client";
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
  findStationsByName(name: string): Promise<ZtmStationWithPlatforms[]>;
  getAll?(table: TableName): Promise<(ZtmStation | ZtmPlatform)[]>;
  getStationById?(id: string): Promise<ZtmStation | null>;
  save?(items: (ZtmStation | ZtmPlatform)[]): Promise<boolean>;
  deleteAll?(table: TableName): Promise<boolean>;
  disconnect?(): void;
};

export class PrismaPostgresService implements DbService {
  prisma: PrismaClientEdge | PrismaClientBrowser;

  constructor(prismaClient: PrismaClientEdge | PrismaClientBrowser) {
    this.prisma = prismaClient;
  }

  disconnect() {
    this.prisma.$disconnect();
  }

  async save(items: TableItem[]): Promise<boolean> {
    let savedItems: Prisma.BatchPayload;
    const tableName = items[0].__brand;
    const itemsWithoutBrand = items.map(removeBrand);
    if (tableName === Brand.Platform) {
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
    if (table === Brand.Platform) {
      return (await this.prisma.platform.findMany()).map((e) =>
        addBrand(e, Brand.Platform)
      );
    } else {
      return (await this.prisma.station.findMany()).map((e) =>
        addBrand(e, Brand.Station)
      );
    }
  }

  async getStationById(ztmId: string): Promise<ZtmStation | null> {
    const stationFromDB = await this.prisma.station.findFirst({
      where: { ztmId },
    });
    return addBrand(stationFromDB!, Brand.Station);
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
      return stations.map(({ name, normalizedName, url, ztmId, Platform }) => ({
        name,
        normalizedName,
        url,
        ztmId,
        platforms: Platform.map((e) => addBrand(e, Brand.Platform)),
        __brand: Brand.StationWithPlatforms,
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
}
