import { Request, Response } from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { IDbService, ITimetableScrapeService } from '../interface';

@controller('/do')
export class MainController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IDbService) private dbService: IDbService,
    @inject(TYPES.ITimetableScrapeService) private scrapeSerive: ITimetableScrapeService,
    @inject(TYPES.ITimetableScrapeService) private scrapeService: ITimetableScrapeService,
  ) { }

  @httpGet('/scrape')
  private scrape(req: Request, res: Response): void {
    console.log(req.method, req.originalUrl, res.statusCode);
    this.scrapeService.scapeTimetable();
  }

  @httpGet('/getStations')
  private async getStations(req: Request, res: Response): Promise<any> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const stations = await this.dbService.getZtmStations();
    res.send(JSON.stringify(stations));
  }

  @httpGet('/deleteStations')
  private deleteStations(req: Request, res: Response): void {
    console.log(req.method, req.originalUrl, res.statusCode);
    this.dbService.deleteAllStations();
  }
}
