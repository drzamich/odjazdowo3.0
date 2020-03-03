import { injectable, inject } from 'inversify';

import { IRealTimeDepartureService, IDepartureList, IDepartureAggregator, IZtmStation, IZtmPlatform } from '../interface';
import { TYPES } from '../IoC/types';
import { DepartureList } from '../schema';

@injectable()
export class DepartureAggregator implements IDepartureAggregator {
  constructor(
    @inject(TYPES.IRealTimeDepartureService) private realTimeDepartureService: IRealTimeDepartureService,
  ) {}

  async getDepartures(station: IZtmStation, platform: IZtmPlatform): Promise<IDepartureList> {
    const platformId = `${station.ztmId}${platform.plNumber}`;
    if (platform.isInSipTw) {
      return this.realTimeDepartureService.getDeparturesForPlatform(platformId);
    }
    return new DepartureList('notInSystem', []);
  }
}
