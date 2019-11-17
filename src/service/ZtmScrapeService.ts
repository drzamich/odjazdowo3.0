import { injectable, inject } from 'inversify';

import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IStation } from '../interface';
import { TYPES } from '../IoC/types';
import { ZtmStation } from '../schema';

@injectable()
export class ZtmScrapeService implements ITimetableScrapeService {
  private url = 'https://www.wtp.waw.pl/rozklady-jazdy/?wtp_dt=2019-11-08&wtp_md=1';

  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
    @inject(TYPES.IWebParseService) private webParseService: IWebParseService,
  ) {}

  async scapeTimetable(): Promise<IStation[]> {
    console.log(`Fetching ${this.url}, please wait...`);
    const fetchedWebsite = await this.webFetchService.get<string>(this.url);
    console.log(`${this.url}, fetched....`);
    return this.getStationList(fetchedWebsite);
  }

  private getStationList(aggregateHtml: string): IStation[] {
    const parsedWebsite = this.webParseService.parseHTMLString(aggregateHtml);
    return [
      new ZtmStation(10, 'test', 'url'),
    ];
  }
}
