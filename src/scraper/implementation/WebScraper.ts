import axios from 'axios';
import cheerio from 'cheerio';
import WebScraperInt from '../interface/WebScraper';

export default class WebScraper implements WebScraperInt {
  async fetchAndParseWebsite(url: string): Promise<CheerioStatic> {
    console.log(url);
    const result: any = await axios.get(url);
    return cheerio.load(result.data);
  }
}