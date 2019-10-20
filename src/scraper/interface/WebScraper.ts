export default interface WebScraper {
  fetchAndParseWebsite(url: string): Promise<CheerioStatic>,
}
