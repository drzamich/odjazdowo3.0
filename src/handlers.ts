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

router.post("*", post);

const validateMessengerWebhook = async (request: Request) => {
  const { url } = request;
  const { searchParams } = new URL(url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === MESSENGER_VERIFY_TOKEN) {
    return new Response(challenge);
  }
  return new Response(undefined, { status: 403 });
};

router.get("/messgener-webhook", validateMessengerWebhook);

router.get("*", generic);

export const handleRequest = (request: Request) => router.handle(request);
