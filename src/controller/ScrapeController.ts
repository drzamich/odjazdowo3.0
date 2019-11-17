import { Request, Response } from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { ITimetableScrapeService } from '../interface';

@controller('/scrape')
export class ScrapeContoller implements interfaces.Controller {
  constructor(
    @inject(TYPES.ITimetableScrapeService) private scrapeService: ITimetableScrapeService,
  ) { }

  @httpGet('/')
  private index(req: Request, res: Response): void {
    console.log(req.method, req.originalUrl, res.statusCode);
    this.scrapeService.scapeTimetable();
  }
}
