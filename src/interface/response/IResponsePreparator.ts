import { IResponse } from './IResponse';
import { IMessagePreparator } from './IMessagePreparator';
import { IStation, IPlatform, IDepartureList } from '../schema';

export interface IResponsePreparator {
  messagePreparator: IMessagePreparator;
  prepareInitialResponses(recipientId: string, locale: string, stations: IStation[], platforms: IPlatform[]): IResponse[];
  prepareDepartureResponses(recipientId: string, locale: string, departureList: IDepartureList): IResponse[];
}
