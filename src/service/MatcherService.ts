import { injectable, inject } from 'inversify';

import Fuse from 'fuse.js';
import { IMatcherService, IDbService, IZtmStation, IZtmPlatform, IMatcherResponse } from '../interface';
import { TYPES } from '../IoC/types';
import { ZtmStation } from '../schema';

export const MAX_MATCHED_STATIONS = 5;

@injectable()
export class MatcherService implements IMatcherService {
  constructor(
   @inject(TYPES.IDbService) private dbService: IDbService,
  ) {}

  async matchStationsAndPlatforms(query: string): Promise<IMatcherResponse> {
    let stations: IZtmStation[] = await this.matchStations(query);
    stations = stations.slice(0, MAX_MATCHED_STATIONS);
    let platforms: IZtmPlatform[] = [];
    if (stations.length === 1) {
      platforms = this.matchPlatforms(stations[0], query);
    }
    return {
      stations,
      platforms,
    };
  }

  private async matchStations(query: string): Promise<IZtmStation[]> {
    const stations = await this.dbService.getAllStations() as IZtmStation[];
    const strictOptions: Fuse.FuseOptions<IZtmStation> = {
      keys: ['normalizedName'],
      findAllMatches: false,
      threshold: 0,
    };
    const looseOptions: Fuse.FuseOptions<IZtmStation> = {
      ...strictOptions,
      threshold: 0.1,
    };
    const strictFuse = new Fuse(stations, strictOptions);
    const looseFuse = new Fuse(stations, looseOptions);

    const strictResultFullQuery = strictFuse.search(query) as IZtmStation[];
    if (strictResultFullQuery.length === 1) return strictResultFullQuery;
    if (strictResultFullQuery.length > 1) return this.chooseBestOfBest(query, strictResultFullQuery);

    const queryWithoutLastWord = query.split(' ').slice(undefined, -1).join(' ');
    const strictResultTrimmedQuery = strictFuse.search(queryWithoutLastWord) as IZtmStation[];
    if (strictResultTrimmedQuery.length === 1) return strictResultTrimmedQuery;
    if (strictResultTrimmedQuery.length > 1) return this.chooseBestOfBest(query, strictResultTrimmedQuery);


    const looseResultFullQuery = looseFuse.search(query) as IZtmStation[];
    if (looseResultFullQuery.length > 0) return looseResultFullQuery;

    const looseResultTrimmedQuery = looseFuse.search(queryWithoutLastWord) as IZtmStation[];
    return looseResultTrimmedQuery;
  }

  private matchPlatforms(station: ZtmStation, query: string): IZtmPlatform[] {
    const lastWordOfQuery = query.split(' ').slice(-1);
    const parsedLastWord = Number(lastWordOfQuery).toString().padStart(2, '0');
    const matchingPlatform = station.platforms.filter(({ plNumber }) => plNumber === parsedLastWord)[0];
    return (matchingPlatform ? [matchingPlatform] : station.platforms);
  }

  private chooseBestOfBest(query: string, stations: IZtmStation[]): IZtmStation[] {
    const queryWithoutLastWord = query.split(' ').slice(undefined, -1).join(' ');
    for (const station of stations) {
      if (query === station.normalizedName) return [station];
    }
    for (const station of stations) {
      if (queryWithoutLastWord === station.normalizedName) return [station];
    }
    return stations;
  }
}
