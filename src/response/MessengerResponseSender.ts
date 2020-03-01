import { inject, injectable } from 'inversify';
import { TYPES } from '../IoC/types';
import { IHttpService } from '../interface/service/IHttpService';
import { IResponseSender } from '../interface/messaging/IResponseSender';
import { IResponse } from '../interface/messaging';
import { MESSENGER_TOKEN } from '../config';

@injectable()
export class MessengerResponseSender implements IResponseSender {
  constructor(
    @inject(TYPES.IHttpService) private httpService: IHttpService,
  ) {}

  async sendResponse(response: IResponse): Promise<void> {
    const url = `https://graph.facebook.com/v6.0/me/messages?access_token=${MESSENGER_TOKEN}`;
    await this.httpService.post(url, response);
  }
}
