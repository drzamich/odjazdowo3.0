import { Router } from "itty-router";

type RequestBody = {
  query: string;
};

const router = Router();

const generic = () => new Response("Hello World!");

const post = async (request: Request) => {
  const body = (await request.json()) as RequestBody;

  return new Response(`the body is ${JSON.stringify(body)}`);
};

router.get("*", generic).post("*", post);

export const handleRequest = (request: Request) => router.handle(request);
