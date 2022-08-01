import { handleRequest } from "./handlers";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event: FetchEvent): Promise<Response> {
  const { request } = event;
  return handleRequest(request);
}
