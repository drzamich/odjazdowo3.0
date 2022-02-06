import { Brand } from "../schema";
import { PrismaPostgresService } from "../service/DbService";
import { DumpService } from "../service/DumpService";

async function main() {
  const dbService = new PrismaPostgresService();
  const dumpService = new DumpService();
  const stations = await dbService.getAll(Brand.station);
  const platforms = await dbService.getAll(Brand.platform);

  dumpService.saveToJSONFile(stations);
  dumpService.saveToJSONFile(platforms);
}

main();
