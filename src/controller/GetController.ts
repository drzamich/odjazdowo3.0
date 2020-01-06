import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { normalizeString } from '../utils';
import { IMatcherService } from '../interface/service/IMatcherService';

@controller('/get')
export class GetController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IMatcherService) private matcherService: IMatcherService,
  ) { }

  @httpGet('/platform')
  private async stations(@queryParam('query') query: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const normalizedQuery = normalizeString(query);
    const matchedStationOrPlatform = await this.matcherService.matchStationOrPlatform(normalizedQuery);
    res.send(matchedStationOrPlatform);
  }
}
