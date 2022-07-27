import { DepartureSevice } from "./service/DepartureService";
import { MatcherService } from "./service/MatcherService";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event: FetchEvent): Promise<Response> {
  const { request } = event;

  const body = JSON.stringify(await request.json());

  // waitUntil method is used for sending logs, after response is sent
  // event.waitUntil(
  //   const matcher = new MatcherService();
  //   const ds = new DepartureSevice();
  //   const query = process.argv[2];
  //   console.time("DBQuery");
  //   console.time("Dep");
  //   const match = await matcher.matchStationsAndPlatforms(query);
  //   console.timeEnd("DBQuery");
  //   if (match.type === "exactMatch") {
  //     const departures = await ds.getDepartures(match.station, match.platform);
  //     console.log(departures);
  //   }
  //   console.timeEnd("Dep");
  // );
  return new Response(`the body is ${body}`);
}
