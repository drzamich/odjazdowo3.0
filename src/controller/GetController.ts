import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { normalizeString } from '../utils';
import { IMatcherService } from '../interface/service/IMatcherService';
import { IDbService, IDepartureAggregator } from '../interface';
import { DepartureList } from '../schema';

@controller('/get')
export class GetController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IMatcherService) private matcherService: IMatcherService,
    @inject(TYPES.IDbService) private dbService: IDbService,
    @inject(TYPES.IDepartureAggregator) private departureAggregator: IDepartureAggregator,
  ) { }

  @httpGet('/departures')
  private async platform(@queryParam('query') query: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const normalizedQuery = normalizeString(query);
    const { stations, platforms } = await this.matcherService.matchStationsAndPlatforms(normalizedQuery);
    let departures = new DepartureList('none', []);
    if (platforms.length === 1) {
      departures = await this.departureAggregator.getDepartures(stations[0], platforms[0]);
    }
    res.send(stations);
  }

  @httpGet('/allStations')
  private async allStations(req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const allStations = await this.dbService.getAllStations();
    res.send(allStations);
  }
}
