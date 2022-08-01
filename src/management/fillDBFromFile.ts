import { PrismaClient } from "@prisma/client";
import { Brand, ZtmPlatform, ZtmStation } from "../schema";
import { PrismaPostgresService } from "../service/DbService";
import { DumpService } from "../service/DumpService";

async function main() {
  const dbService = new PrismaPostgresService(new PrismaClient());
  const dumpService = new DumpService();
  const stations = (await dumpService.loadFromJSONFIle(
    Brand.Station
  )) as ZtmStation[];
  const platforms = (await dumpService.loadFromJSONFIle(
    Brand.Platform
  )) as ZtmPlatform[];

  dbService.save(stations);
  dbService.save(platforms);
}

main();
