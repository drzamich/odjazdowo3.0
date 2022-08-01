import { PrismaClient } from "@prisma/client";
import { Brand } from "../schema";
import { PrismaPostgresService } from "../service/DbService";

async function main() {
  const dbService = new PrismaPostgresService(new PrismaClient());
  const success =
    (await dbService.deleteAll(Brand.Platform)) &&
    (await dbService.deleteAll(Brand.Station));

  if (success) {
    console.log("Successfully cleared the DB.");
  } else {
    console.error("Error clearing the DB.");
  }
}

main();
