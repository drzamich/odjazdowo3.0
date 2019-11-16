import cheerio from 'cheerio';

import { IWebParseService } from 'src/interface';

export class WebParseService implements IWebParseService {
  parseHTMLString(HTMLString: string): CheerioStatic {
    return cheerio.load(HTMLString);
  }
}
