import { Container } from 'inversify';
import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService } from '../interface';
import { ZtmScrapeService, WebFetchService, WebParseService } from '../service';
import { TYPES } from './types';
import { ScrapeContoller } from '../controller';

const container = new Container();

container.bind<ScrapeContoller>(TYPES.ScrapeContoller).to(ScrapeContoller).inSingletonScope();
container.bind<ITimetableScrapeService>(TYPES.ITimetableScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IWebFetchSerivce>(TYPES.IWebFetchService).to(WebFetchService).inSingletonScope();
container.bind<IWebParseService>(TYPES.IWebParseService).to(WebParseService).inSingletonScope();

export { container };
