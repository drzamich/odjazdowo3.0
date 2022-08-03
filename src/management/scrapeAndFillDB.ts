import { PrismaClient } from "@prisma/client";
import { PrismaPostgresService } from "../service/DbService";
import { DumpService } from "../service/DumpService";
import { ZtmScrapeService } from "../service/ZtmScrapeService";

async function main() {
  const ztmScrapeService = new ZtmScrapeService();
  const dbService = new PrismaPostgresService(new PrismaClient());
  const dumpService = new DumpService();
  const stations = await ztmScrapeService.getStations();
  const platforms = await ztmScrapeService.getPlatforms(stations);
  const success =
    (await dbService.save(stations)) && (await dbService.save(platforms));
  if (success) {
    console.log("Successfully inserted data into database.");
  } else {
    console.error("Error filling DB with information");
  }
  dumpService.saveToJSONFile(stations);
  dumpService.saveToJSONFile(platforms);
}

main();
