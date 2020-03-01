/* eslint-disable @typescript-eslint/camelcase */
import { injectable } from 'inversify';
import { IMessagePreparator, IMessage, IStrings, IQuickReply } from '../interface/messaging';
import { IZtmStation, IDepartureList, IZtmPlatform, IStation, IPlatform } from '../interface';
import { strings } from './strings';

@injectable()
export class MessagePreparator implements IMessagePreparator {
  public strings: IStrings = strings.en;

  prepareInitialMessages(locale = 'en', stations: IZtmStation[], platforms: IZtmPlatform[]): IMessage[] {
    this.strings = locale === 'en' ? strings.en : strings.pl;
    const stationMessages: IMessage[] = this.prepareStationResponse(stations);
    const platformMessages: IMessage[] = this.preparePlatformResponse(stations, platforms);
    return [...stationMessages, ...platformMessages];
  }

  prepareDepartureMessages(locale = 'en', departureList: IDepartureList): IMessage[] {
    this.strings = locale === 'en' ? strings.en : strings.pl;
    switch (departureList.departures.length) {
      case 0:
        return [{ text: this.strings.departures_not_available }];
      default:
        return [{ text: departureList.getCombinedText() }];
    }
  }

  private prepareStationResponse(stations: IStation[]): IMessage[] {
    let quick_replies: IQuickReply[];
    switch (stations.length) {
      case 0:
        return [{ text: this.strings.station_not_found }];
      case 1:
        return [{ text: `${this.strings.departures_for}: ${stations[0].name}` }];
      default:
        quick_replies = stations.map(({ name }) => ({ title: name, payload: name }));
        return [
          { text: this.strings.multiple_stations_found },
          { text: this.strings.choose_one_station, quick_replies },
        ];
    }
  }

  private preparePlatformResponse(stations: IStation[], platforms: IPlatform[]): IMessage[] {
    let quick_replies: IQuickReply[];
    switch (platforms.length) {
      case 1:
        return [{ text: `${this.strings.platform} ${platforms[0].plNumber} ${this.strings.direction_short} ${platforms[0].direction}` }];
      default:
        quick_replies = platforms.map(platform => ({
          title: `${platform.plNumber} (${this.strings.direction_short} ${platform.direction})`,
          payload: `${stations[0].name} ${platform.plNumber}`,
        }));
        return [{ text: this.strings.choose_one_platform, quick_replies }];
    }
  }
}
