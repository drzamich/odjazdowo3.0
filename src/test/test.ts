import { DepartureSevice } from "../service/DepartureService";
import { MatcherService } from "../service/MatcherService";

async function main() {
  const matcher = new MatcherService();
  const ds = new DepartureSevice();
  const query = process.argv[2];
  const match = await matcher.matchStationsAndPlatforms(query);
  if (match.type === "exactMatch") {
    const departures = await ds.getDepartures(match.station, match.platform);
    console.log(departures);
  }
}

main();
