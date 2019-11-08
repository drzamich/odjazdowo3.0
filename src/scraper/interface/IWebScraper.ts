export default interface IWebScraper {
  fetchAndParseWebsite(url: string): void;
}
