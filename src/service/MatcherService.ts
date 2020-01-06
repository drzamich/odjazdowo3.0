import { injectable, inject } from 'inversify';

import Fuse from 'fuse.js';
import { IMatcherService } from '../interface/service/IMatcherService';
import { TYPES } from '../IoC/types';
import { IDbService } from '../interface';

export type StationNameWithId = {
  _id: string;
  normalizedName: string;
};

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
    const strictOptions: Fuse.FuseOptions<StationNameWithId> = {
      keys: ['normalizedName'],
      id: '_id',
      threshold: 0,
    };
    const looseOptions: Fuse.FuseOptions<StationNameWithId> = {
      ...strictOptions,
      threshold: 0.4,
    };
    const strictFuse = new Fuse(stationNamesWithIds, strictOptions);
    const looseFuse = new Fuse(stationNamesWithIds, looseOptions);

    const strictResultFullQuery = strictFuse.search(query) as string[];
    if (strictResultFullQuery.length > 0) return strictResultFullQuery;

    const trimmedQuery = query.split(' ').slice(undefined, -1).join(' ');
    const strictResultTrimmedQuery = strictFuse.search(trimmedQuery) as string[];
    if (strictResultTrimmedQuery.length > 0) return strictResultTrimmedQuery;

    const looseResultFullQuery = looseFuse.search(query) as string[];
    if (looseResultFullQuery.length > 0) return looseResultFullQuery;

    const looseResultTrimmedQuery = looseFuse.search(trimmedQuery) as string[];
    return looseResultTrimmedQuery;
  }
}
