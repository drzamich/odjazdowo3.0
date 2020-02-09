import { IText } from './IText';
import { IQuickReply } from './IQuickReply';

export interface IMessage {
  text: IText;
  quick_replies: IQuickReply[];
}
