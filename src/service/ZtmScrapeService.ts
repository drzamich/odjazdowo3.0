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
    const $ = this.webParseService.parseHTMLString(aggregateHtml);
    const emptyStationList = this.generateEmptyStations($);
    return emptyStationList;
  }

  private generateEmptyStations($: CheerioStatic): IStation[] {
    const links = $('.timetable-stops-block-body-item a');
    const warsawIdentifier = '(Warszawa)';
    const emptyStationList: IStation[] = [];
    const warsawLinks = links.filter((index, element) => (
      $(element).text().includes(warsawIdentifier)
    ));
    warsawLinks.each((index, element) => {
      const item = $(element);
      const url = item.attr('href');
      const fullName = item.find('span').first().text();
      const name = fullName.split(warsawIdentifier)[0];
      const id = url.split('wtp_st=')[1];
      emptyStationList.push(new ZtmStation(id, name, url));
    });
    return emptyStationList;
  }
}
