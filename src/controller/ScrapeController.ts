import { Request, Response } from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { IScrapeService } from '../interface';

@controller('/scrape')
export class ScrapeContoller implements interfaces.Controller {
  constructor(
    @inject(TYPES.IScrapeService) private scrapeService: IScrapeService,
  ) { }

  @httpGet('/')
  private index(req: Request, res: Response): void {
    console.log(req.method, req.originalUrl, res.statusCode);
    this.scrapeService.fetchAndParseWebsite();
  }
}
