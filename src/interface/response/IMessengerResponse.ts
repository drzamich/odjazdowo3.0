import { IResponse } from './IResponse';

export interface IMessengerResponse extends IResponse {
  recipient: {
    id: string;
  };
  messaging_type: 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG';
}
