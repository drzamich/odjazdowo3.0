import { z } from "zod";

const receivedMessageSchema = z.object({
  entry: z.array(
    z.object({
      messaging: z.array(
        z.object({
          sender: z.object({
            id: z.string(),
          }),
        })
      ),
    })
  ),
});

type ReceivedMessage = z.infer<typeof receivedMessageSchema>;

type Response = {
  messaging_type: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
};

export class MessengerService {
  private senderId: string = "";
  constructor() {}

  async handleRequest(request: Request) {
    const body = await request.json();
    try {
      receivedMessageSchema.parse(body);
      this.senderId = (body as ReceivedMessage).entry[0].messaging[0].sender.id;
    } catch {
      throw new Error("Incorrect incoming message format");
    }
  }

  async respond(text: string) {
    const API_URL = `https://graph.facebook.com/v14.0/me/messages?access_token=${MESSENGER_PAGE_ACCESS_TOKEN}`;

    const payload: Response = {
      messaging_type: "RESPONSE",
      recipient: {
        id: this.senderId,
      },
      message: {
        text,
      },
    };

    const request = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!request.ok) {
      const error = await request.json();
      console.log(JSON.stringify(error));
    }
  }
}
