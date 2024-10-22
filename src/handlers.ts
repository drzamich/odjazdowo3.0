import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { Router } from "itty-router";

import { MessengerService } from "./service/MessengerService";
import { ResponseService } from "./service/ResponseService";

const router = Router();

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
  const messengerService = new MessengerService();
  const query = await messengerService.receiveRequest(request);
  const start = Date.now();
  const responseService = new ResponseService(query, new PrismaClientEdge());
  const responseMessage = await responseService.getResponseMessage();
  const end = Date.now();
  console.log(`Core time [s]: ${(end - start) / 1000}`);
  await messengerService.respond(responseMessage);
  return new Response(undefined, { status: 200 });
};

router.post("/messenger-webhook", handleMessengerMessage);

export const handleRequest = (request: Request) => router.handle(request);
