import Station from './Station';
import WebScraper from './WebScraper';

export default interface TimetableScraper extends WebScraper {
  baseUrl: string,
  aggregatePageUrl: string,
  generateStationList(): Station[];
}
