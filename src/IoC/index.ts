import { Container } from 'inversify';
import { IScrapeService, IWebFetchSerivce } from '../interface';
import { ZtmScrapeService, WebFetchService } from '../service';
import { TYPES } from './types';
import { ScrapeContoller } from '../controller';

const container = new Container();

container.bind<ScrapeContoller>(TYPES.ScrapeContoller).to(ScrapeContoller).inSingletonScope();
container.bind<IScrapeService>(TYPES.IScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IWebFetchSerivce>(TYPES.IWebFetchService).to(WebFetchService).inSingletonScope();

export { container };
