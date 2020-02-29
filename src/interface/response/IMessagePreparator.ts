import { IStation, IPlatform, IDepartureList } from '..';
import { IMessage } from './IMessage';
import { IStrings } from './IStrings';

export interface IMessagePreparator {
  strings: IStrings;
  prepareInitialMessages(locale: string, stations: IStation[], platforms: IPlatform[]): IMessage[];
  prepareDepartureMessages(locale: string, departureList: IDepartureList): IMessage[];
}
