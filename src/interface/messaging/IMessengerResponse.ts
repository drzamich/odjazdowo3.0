import { IResponse } from './IResponse';

export interface IMessengerResponse extends IResponse {
  messaging_type: 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG';
  recipient: {
    id: string;
  };
}
