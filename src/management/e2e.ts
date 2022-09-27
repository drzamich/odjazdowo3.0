import * as dotenv from "dotenv";
import { PrismaClient as PrismaClientBrowser } from "@prisma/client";
import { PrismaPostgresService } from "../service/DbService";
import { DepartureService } from "../service/DepartureService";
import { MatcherService } from "../service/MatcherService";
async function main() {
  dotenv.config();
  const matcher = new MatcherService(
    new PrismaPostgresService(new PrismaClientBrowser())
  );
  const ds = new DepartureService();
  const query = process.argv[2];
  console.time("DBQuery");
  console.time("Dep");
  const match = await matcher.match(query);
  console.timeEnd("DBQuery");
  if (match.type === "exactMatch") {
    const departures = await ds.getDepartures(match.station, match.platform);
    console.log(departures);
  }
  console.timeEnd("Dep");
}

main();
