import { z } from "zod";

const receivedMessageSchema = z.object({
  entry: z.array(
    z.object({
      messaging: z.array(
        z.object({
          sender: z.object({
            id: z.string(),
          }),
          message: z.object({
            text: z.string(),
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
  private senderId = "";

  async receiveRequest(request: Request) {
    const body = (await request.json()) as ReceivedMessage;
    try {
      receivedMessageSchema.parse(body);
    } catch {
      throw new Error("Incorrect incoming message format");
    }
    this.senderId = body.entry[0].messaging[0].sender.id;
    return body.entry[0].messaging[0].message.text;
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
