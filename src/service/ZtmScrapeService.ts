import { injectable, inject } from 'inversify';

import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IStation } from '@interface';
import { TYPES } from '../IoC/types';

@injectable()
export class ZtmScrapeService implements ITimetableScrapeService {
  private url = 'https://www.wtp.waw.pl/rozklady-jazdy/?wtp_dt=2019-11-08&wtp_md=1';

  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
    @inject(TYPES.IWebParseService) private webParseServide: IWebParseService,
  ) {}

  async scapeTimetable(): Promise<IStation[]> {
    console.log(`Fetching ${this.url}, please wait...`);
    const fetchedWebsite = await this.webFetchService.get<string>(this.url);
    console.log(`${this.url}, fetched....`);
  }

  private getStationList(aggregateHtml: string): IStation[] {

  }
}
