import { IQuickReply } from './IQuickReply';

export interface IMessage {
  text: string;
  quick_replies?: IQuickReply[];
}
