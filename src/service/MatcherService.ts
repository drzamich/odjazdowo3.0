import { injectable, inject } from 'inversify';

import { IMatcherService } from '../interface/service/IMatcherService';
import { TYPES } from '../IoC/types';
import { IDbService, IStation } from '../interface';
import { ZtmStation } from '../schema';

interface StationNameWithId {
  _id: string;
  normalizedName: string;
}

@injectable()
export class MatcherService implements IMatcherService {
  constructor(
   @inject(TYPES.IDbService) private dbService: IDbService,
  ) {}

  async matchStationOrPlatform(query: string): Promise<any[]> {
    const matchedStationIds = await this.matchStationIds(query);
    return matchedStationIds;
    // if (matchedStations.length !== 1) {
    //   return matchedStations;
    // }
    // const matchedPlatforms;
  }

  public async matchStationIds(query: string): Promise<string[]> {
    const stationNamesWithIds = await this.dbService.getAllStationNames() as StationNameWithId[];
    const stationNames = stationNamesWithIds.map(station => station.normalizedName);
    const splittedQuery = query.split(' ');
    let matchedNames: string[] = [];
    for (let i = 1; i <= splittedQuery.length; i += 1) {
      const compoundName = splittedQuery.slice(0, i).join(' ');
      const match = stationNames.filter(name => name.startsWith(compoundName));
      if (match.length > 0) {
        matchedNames = match;
      }
    }
    const filteredList = stationNamesWithIds.filter(station => matchedNames.includes(station.normalizedName));
    // eslint-disable-next-line dot-notation
    const ids = filteredList.map(station => station['_id']);
    return ids;
  }
}
