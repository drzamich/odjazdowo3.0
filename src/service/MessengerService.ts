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
            quick_reply: z.optional(
              z.object({
                payload: z.string(),
              })
            ),
          }),
        })
      ),
    })
  ),
});

type ReceivedMessage = z.infer<typeof receivedMessageSchema>;

export type QuickReply = {
  content_type: "text" | "user_phone_number" | "user_email";
  title: string;
  payload: string;
  image_url?: string;
};

export type Message = {
  text: string;
  quick_replies?: QuickReply[];
};

type Response = {
  messaging_type: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
  recipient: {
    id: string;
  };
  message: Message;
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
    const message = body.entry[0].messaging[0].message;
    const quickReplyPayload = message.quick_reply?.payload;
    const messageText = message.text;
    // Quick reply payload has precedence because its text is
    // only a UX thing, e.g. "Refresh"
    return quickReplyPayload || messageText;
  }

  async respond(message: Message) {
    const API_URL = `https://graph.facebook.com/v14.0/me/messages?access_token=${MESSENGER_PAGE_ACCESS_TOKEN}`;

    const payload: Response = {
      messaging_type: "RESPONSE",
      recipient: {
        id: this.senderId,
      },
      message,
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
