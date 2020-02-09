import { IMessage } from './IMessage';
import { IResponse } from './IResponse';

export interface IResponsePreparator {
  prepareResponse(message: IMessage): IResponse;
}
