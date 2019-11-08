export interface IWebParseService {
  parseHTMLString(HTMLString: string): Cheerio;
}
