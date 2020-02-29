import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { normalizeString } from '../utils';
import { IMatcherService } from '../interface/service/IMatcherService';
import { IDbService, IDepartureAggregator } from '../interface';
import { DepartureList } from '../schema';
import { IResponsePreparator, IResponse } from '../interface/response';

@controller('/get')
export class GetController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IMatcherService) private matcherService: IMatcherService,
    @inject(TYPES.IDbService) private dbService: IDbService,
    @inject(TYPES.IDepartureAggregator) private departureAggregator: IDepartureAggregator,
    @inject(TYPES.IResponsePreparator) private responsePreparator: IResponsePreparator,
  ) { }

  @httpGet('/departures')
  private async platform(@queryParam('query') query: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const normalizedQuery = normalizeString(query);
    const { stations, platforms } = await this.matcherService.matchStationsAndPlatforms(normalizedQuery);
    const initialResponses: IResponse[] = this.responsePreparator.prepareInitialResponses('0', 'en', stations, platforms);
    let departureList = new DepartureList('none', []);
    if (platforms.length === 1) {
      departureList = await this.departureAggregator.getDepartures(stations[0], platforms[0]);
    }
    const departureResponses = this.responsePreparator.prepareDepartureResponses('0', 'en', departureList);
    res.send(initialResponses);
  }

  @httpGet('/allStations')
  private async allStations(req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const allStations = await this.dbService.getAllStations();
    res.send(allStations);
  }
}
