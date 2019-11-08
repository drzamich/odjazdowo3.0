import Station from './IStation';
import WebScraper from './IWebScraper';

export default interface ITimetableScraper extends WebScraper {
  baseUrl: string;
  aggregatePageUrl: string;
  generateStationList(): Station[];
}
