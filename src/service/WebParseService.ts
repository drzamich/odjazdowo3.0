import cheerio from 'cheerio';
import { injectable } from 'inversify';

import { IWebParseService } from '../interface';

@injectable()
export class WebParseService implements IWebParseService {
  parseHTMLString(HTMLString: string): CheerioStatic {
    return cheerio.load(HTMLString);
  }
}
