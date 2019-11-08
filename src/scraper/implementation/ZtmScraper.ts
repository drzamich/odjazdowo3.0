import WebScraper from './WebScraper';
import { IStation, ITimetableScraper } from '../interface';

export default class ZtmScraper extends WebScraper implements ITimetableScraper {
  baseUrl = 'http://www.ztm.waw.pl/';

  aggregatePageUrl = `${this.baseUrl}rozklad_nowy.php?c=183&l=1`;

  generateStationList(): IStation[] {
    this.fetchAggregatePage();
    return [];
  }

  async fetchAggregatePage(): Promise<any> {
    const cheerio = await this.fetchAndParseWebsite(this.aggregatePageUrl);
    console.log(cheerio);
  }
}
