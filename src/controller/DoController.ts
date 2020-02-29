import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { IDbService, ITimetableScrapeService, IZtmStation } from '../interface';
import { TOKEN } from '../config';

@controller('/do')
export class DoController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IDbService) private dbService: IDbService,
    @inject(TYPES.ITimetableScrapeService) private scrapeSerive: ITimetableScrapeService,
    @inject(TYPES.ITimetableScrapeService) private scrapeService: ITimetableScrapeService,
  ) { }

  @httpGet('/scrapeAndSave')
  private async scrape(@queryParam('token') token: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    if (token !== TOKEN) {
      res.send('Access denied');
      return;
    }
    const stations = await this.scrapeService.scapeTimetable() as IZtmStation[];
    if (stations.length) {
      const deleteProcess = this.dbService.deleteAllStations();
      if (deleteProcess) {
        const saveProcess = this.dbService.saveStations(stations);
        if (saveProcess) {
          res.send('Scraping process completed.');
          return;
        }
      }
    }
    res.send('Scraping process failed.');
  }

  @httpGet('/clearDb')
  private deleteStations(@queryParam('token') token: string, req: Request, res: Response): void {
    if (token !== TOKEN) {
      res.send('Access denied');
      return;
    }
    console.log(req.method, req.originalUrl, res.statusCode);
    this.dbService.deleteAllStations();
    res.send('Database cleared.');
  }
}
