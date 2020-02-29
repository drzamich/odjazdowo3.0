import { IStation, IPlatform, IDepartureList } from '..';
import { IMessage } from './IMessage';
import { IStrings } from './IStrings';

export interface IMessagePreparator {
  locale: string;
  strings: IStrings;
  prepareInitialResponses(stations: IStation[], platforms: IPlatform[]): IMessage[];
  prepareDepartureResponse(departures: IDepartureList): IMessage[];
}
