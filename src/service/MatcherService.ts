import { injectable, inject } from 'inversify';

import Fuse from 'fuse.js';
import { IMatcherService, IDbService, IZtmStation, IZtmPlatform, IMatcherResponse } from '../interface';
import { TYPES } from '../IoC/types';
import { ZtmStation } from '../schema';

@injectable()
export class MatcherService implements IMatcherService {
  constructor(
   @inject(TYPES.IDbService) private dbService: IDbService,
  ) {}

  async matchStationsAndPlatforms(query: string): Promise<IMatcherResponse> {
    const stations: IZtmStation[] = await this.matchStations(query);
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
      threshold: 0,
    };
    const looseOptions: Fuse.FuseOptions<IZtmStation> = {
      ...strictOptions,
      threshold: 0.4,
    };
    const strictFuse = new Fuse(stations, strictOptions);
    const looseFuse = new Fuse(stations, looseOptions);

    const strictResultFullQuery = strictFuse.search(query) as IZtmStation[];
    if (strictResultFullQuery.length > 0) return strictResultFullQuery;

    const trimmedQuery = query.split(' ').slice(undefined, -1).join(' ');
    const strictResultTrimmedQuery = strictFuse.search(trimmedQuery) as IZtmStation[];
    if (strictResultTrimmedQuery.length > 0) return strictResultTrimmedQuery;

    const looseResultFullQuery = looseFuse.search(query) as IZtmStation[];
    if (looseResultFullQuery.length > 0) return looseResultFullQuery;

    const looseResultTrimmedQuery = looseFuse.search(trimmedQuery) as IZtmStation[];
    return looseResultTrimmedQuery;
  }

  private matchPlatforms(station: ZtmStation, query: string): IZtmPlatform[] {
    const lastWordOfQuery = query.split(' ').slice(-1);
    const parsedLastWord = Number(lastWordOfQuery).toString().padStart(2, '0');
    const matchingPlatform = station.platforms.filter(({ plNumber }) => plNumber === parsedLastWord)[0];
    return (matchingPlatform ? [matchingPlatform] : station.platforms);
  }
}
