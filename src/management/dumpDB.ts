import { Brand } from "../schema";
import { PrismaPostgresService } from "../service/DbService";
import { DumpService } from "../service/DumpService";
import { PrismaClient } from "@prisma/client";

async function main() {
  const dbService = new PrismaPostgresService(new PrismaClient());
  const dumpService = new DumpService();
  const stations = await dbService.getAll(Brand.Station);
  const platforms = await dbService.getAll(Brand.Platform);

  dumpService.saveToJSONFile(stations);
  dumpService.saveToJSONFile(platforms);
}

main();
