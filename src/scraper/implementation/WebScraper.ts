import { IWebScraper } from '../interface';

export default class WebScraper implements IWebScraper {
  constructor(private fefetchedWebsite: string) {

  }

  fetchAndParseWebsite(url: string): void {
    this.fefetchedWebsite = url;
  }
}
