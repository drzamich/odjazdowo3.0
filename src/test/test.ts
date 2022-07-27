import { DepartureSevice } from "../service/DepartureService";
import { MatcherService } from "../service/MatcherService";

async function main() {
  const matcher = new MatcherService();
  const ds = new DepartureSevice();
  const query = process.argv[2];
  console.time("DBQuery");
  console.time("Dep");
  const match = await matcher.matchStationsAndPlatforms(query);
  console.timeEnd("DBQuery");
  if (match.type === "exactMatch") {
    const departures = await ds.getDepartures(match.station, match.platform);
    console.log(departures);
  }
  console.timeEnd("Dep");
}

main();
