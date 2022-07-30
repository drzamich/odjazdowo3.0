import { DepartureSevice } from "./service/DepartureService";
import { MatcherService } from "./service/MatcherService";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

type RequestBody = {
  query: string;
};

async function handleEvent(event: FetchEvent): Promise<Response> {
  const { request } = event;

  const requestMethod = request.method;

  if (requestMethod === "POST") {
    const body = (await request.json()) as RequestBody;

    // const matcher = new MatcherService();
    // const ds = new DepartureSevice();
    // console.time("DBQuery");
    // console.time("Dep");
    // const match = await matcher.matchStationsAndPlatforms(body.query);
    // console.timeEnd("DBQuery");
    // if (match.type === "exactMatch") {
    //   const departures = await ds.getDepartures(match.station, match.platform);
    //   console.log(departures);
    // }
    // console.timeEnd("Dep");
    return new Response(`the body is ${JSON.stringify(body)}`);
  }

  return new Response("Hello world");
}
