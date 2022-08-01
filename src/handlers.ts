import { Router } from "itty-router";
import { Message, MessengerService } from "./service/MessengerService";

type RequestBody = {
  query: string;
};

const router = Router();

const generic = async () => {
  return new Response("Hello World!");
};

const post = async (request: Request) => {
  const body = (await request.json()) as RequestBody;

  return new Response(`the body is ${JSON.stringify(body)}`);
};

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

router.get("/messenger-webhook", validateMessengerWebhook);

const handleMessengerMessage = async (request: Request) => {
  const body = (await request.json()) as Message;
  const messengerService = new MessengerService(body);
  await messengerService.respond("test");
  return new Response(undefined, { status: 200 });
};

router.post("/messenger-webhook", handleMessengerMessage);

router.get("*", generic);

router.post("*", post);

export const handleRequest = (request: Request) => router.handle(request);
