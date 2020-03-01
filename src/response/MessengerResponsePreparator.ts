import { inject, injectable } from 'inversify';
import { IResponsePreparator, IMessagePreparator, IMessengerResponse, IMessage } from '../interface/messaging';
import { TYPES } from '../IoC/types';
import { IZtmStation, IZtmPlatform, IDepartureList } from '../interface';

@injectable()
export class MessengerResponsePreparator implements IResponsePreparator {
  constructor(
    @inject(TYPES.IMessagePreparator) public messagePreparator: IMessagePreparator,
  ) {}

  prepareInitialResponses(recipientId: string, locale: string, stations: IZtmStation[], platforms: IZtmPlatform[]): IMessengerResponse[] {
    const initialMessages = this.messagePreparator.prepareInitialMessages(locale, stations, platforms);
    return this.parseResponses(initialMessages, recipientId);
  }

  prepareDepartureResponses(recipientId: string, locale: string, departureList: IDepartureList): IMessengerResponse[] {
    const departureMessages = this.messagePreparator.prepareDepartureMessages(locale, departureList);
    return this.parseResponses(departureMessages, recipientId);
  }

  private parseResponses(messages: IMessage[], recipentId: string): IMessengerResponse[] {
    return messages.map(message => ({
      messaging_type: 'RESPONSE',
      recipient: {
        id: recipentId,
      },
      message,
    }));
  }
}
