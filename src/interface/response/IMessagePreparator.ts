import { IStation, IPlatform, IDepartureList } from '..';
import { IMessage } from './IMessage';

export interface IMessagePreparator {
  locale: 'en' | 'pl';
  prepareMessage(stations: IStation[], platforms: IPlatform[], departures: IDepartureList): IMessage;
}
