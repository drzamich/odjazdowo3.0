import { injectable, inject } from 'inversify';

import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IStation, IPlatform, IZtmStation, IZtmPlatform } from '../interface';
import { TYPES } from '../IoC/types';
import { ZtmStation } from '../schema';
import { ZtmPlatform } from '../schema/ztm/ZtmPlatform';

@injectable()
export class ZtmScrapeService implements ITimetableScrapeService {
  constructor(
    @inject(TYPES.IWebFetchService) private webFetchService: IWebFetchSerivce,
    @inject(TYPES.IWebParseService) private webParseService: IWebParseService,
    private aggegateUrl = 'https://www.wtp.waw.pl/rozklady-jazdy/?wtp_dt=2019-12-15&wtp_md=1',
  ) {}

  async scapeTimetable(): Promise<IStation[]> {
    const stationsWithoutPlatforms = await this.getEmptyStations(this.aggegateUrl);
    const stationsWithPlatforms = this.getPlatforms(stationsWithoutPlatforms);
    return stationsWithPlatforms;
  }

  public async getEmptyStations(aggregatePageUrl: string): Promise<IZtmStation[]> {
    // console.log(`Fetching ${aggregatePageUrl}, please wait...`);
    const fetchedWebsite = await this.webFetchService.get<string>(aggregatePageUrl);
    // console.log(`${aggregatePageUrl}, fetched....`);
    const $ = this.webParseService.parseHTMLString(fetchedWebsite);
    const links = $('.timetable-stops-block-body-item a');
    const warsawIdentifier = '(Warszawa)';
    const emptyStationList: IZtmStation[] = [];
    const warsawLinks = links.filter((index, element) => (
      $(element).text().includes(warsawIdentifier)
    ));
    warsawLinks.each((index, element) => {
      const item = $(element);
      const url = item.attr('href');
      const fullName = item.find('span').first().text();
      const name = fullName.split(warsawIdentifier)[0].trim();
      const ztmId = url.split('wtp_st=')[1];
      const ztmStation = new ZtmStation(ztmId, name, url);
      emptyStationList.push(ztmStation);
    });
    return emptyStationList;
  }

  public async getPlatforms(emptyStations: IZtmStation[]): Promise<IZtmStation[]> {
    const result: IZtmStation[] = [];
    emptyStations.forEach(async ({ ztmId, url, name }) => {
      const fetchedWebsite = await this.webFetchService.get<string>(url);
      const $ = this.webParseService.parseHTMLString(fetchedWebsite);
      const links = $('.timetable-link');
      const platforms: IZtmPlatform[] = [];
      links.each((index, element) => {
        const item = $(element);
        const platformUrl = item.attr('href');
        const fullName = item.find('.timetable-stop-point-title-name').text().trim().split(' ');
        const plNumber = fullName[fullName.length - 1];
        const direction = item.find('.timetable-stop-point-title-destination').text().trim();
        platforms.push(new ZtmPlatform(plNumber, direction, platformUrl));
      });
      result.push(new ZtmStation(ztmId, name, url, platforms));
    });
    return result;
  }
}
