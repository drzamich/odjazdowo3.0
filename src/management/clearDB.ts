import { PrismaPostgresService } from "../service/DbService";

async function main() {
  const dbService = new PrismaPostgresService();
  const success =
    (await dbService.deleteAll("platform")) &&
    (await dbService.deleteAll("station"));

  if (success) {
    console.log("Successfully cleared the DB.");
  } else {
    console.error("Error clearing the DB.");
  }
}

main();
