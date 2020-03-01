import { IResponse } from './IResponse';

export interface IResponseSender {
  sendResponse(response: IResponse): Promise<void>;
}
