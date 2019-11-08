import { injectable, inject } from 'inversify';

import { IScrapeService, IWebFetchSerivce } from '../interface';
import { TYPES } from '../IoC/types';

@injectable()
export class ZtmScrapeService implements IScrapeService {
  private url = 'https://www.wtp.waw.pl/rozklady-jazdy/?wtp_dt=2019-11-08&wtp_md=1';

  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
  ) {}

  async fetchAndParseWebsite(): Promise<any> {
    const html = await this.webFetchService.get<string>(this.url);
    console.log(html);
  }
}
