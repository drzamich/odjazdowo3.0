import TimetableScraper from '../interface/TimetableScraper';
import WebScraper from './WebScraper';
import Station from '../interface/Station';

export default class ZtmScraper extends WebScraper implements TimetableScraper {
  constructor() {
    super();
  }

  baseUrl = 'http://www.ztm.waw.pl/';
  aggregatePageUrl = this.baseUrl + 'rozklad_nowy.php?c=183&l=1';

  generateStationList() {
    return [];
  }

  async fetchAggregatePage(): Promise<any> {
    const cheerio = await this.fetchAndParseWebsite(this.aggregatePageUrl);
    console.log(cheerio);
  }
}
