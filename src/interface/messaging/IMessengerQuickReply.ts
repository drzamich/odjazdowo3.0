import { IQuickReply } from './IQuickReply';

export interface IMessengerQuickReply extends IQuickReply {
  content_type: 'text' | 'user_phone_number' | 'user_email';
  image_url?: string;
}
