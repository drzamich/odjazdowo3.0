const EXAMPLE_MESSAGE = {
  object: "page",
  entry: [
    {
      id: "2037087543002596",
      time: 1659206478990,
      messaging: [
        {
          sender: {
            id: "2742639875761499",
          },
          recipient: {
            id: "2037087543002596",
          },
          timestamp: 1659206478703,
          message: {
            mid: "m_wO_h4yEh9Gw46gNn2iTUFOMfLLrpUAZYgLOnWs5B1zotN5Yzcn2TkhlvvhtyKqFAT5WAnSGFe6HbiLo14VWr2A",
            text: "1",
          },
        },
      ],
    },
  ],
};

const EXAMPLE_RESPONSE = {
  messaging_type: "",
  recipient: {
    id: "<PSID>",
  },
  message: {
    text: "hello, world!",
  },
};

export type Message = typeof EXAMPLE_MESSAGE;
type Response = typeof EXAMPLE_RESPONSE;

const API_URL = `https://graph.facebook.com/v14.0/me/messages?access_token=${MESSENGER_PAGE_ACCESS_TOKEN}`;

export class MessengerService {
  private senderId: string;
  constructor(private message: Message) {
    this.senderId = message.entry[0].messaging[0].sender.id;
  }

  async respond(text: string) {
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
