import { Brand, ZtmPlatform, ZtmStation } from "../schema";
import { PrismaPostgresService } from "../service/DbService";
import { DumpService } from "../service/DumpService";

async function main() {
  const dbService = new PrismaPostgresService();
  const dumpService = new DumpService();
  const stations = (await dumpService.loadFromJSONFIle(
    Brand.station
  )) as ZtmStation[];
  const platforms = (await dumpService.loadFromJSONFIle(
    Brand.platform
  )) as ZtmPlatform[];

  dbService.save(stations);
  dbService.save(platforms);
}

main();
