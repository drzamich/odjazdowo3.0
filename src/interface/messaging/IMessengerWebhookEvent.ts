export interface IMessengerWebhookEvent {
  object: string;
  entry: [
    {
      id: string;
      time: number;
      messaging: [
        {
          sender: {
            id: string;
          };
          recipient: {
            id: string;
          };
          message: {
            mid: string;
            text: string;
            quick_reply?: {
              payload: string;
            };
          };
        },
      ];
    }
  ];
}
