import { Container } from 'inversify';
import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IDbService } from '../interface';
import { ZtmScrapeService, WebFetchService, WebParseService, DbService } from '../service';
import { TYPES } from './types';
import { MainController } from '../controller';

const container = new Container();

container.bind<MainController>(TYPES.MainController).to(MainController).inSingletonScope();
container.bind<ITimetableScrapeService>(TYPES.ITimetableScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IWebFetchSerivce>(TYPES.IWebFetchService).to(WebFetchService).inSingletonScope();
container.bind<IWebParseService>(TYPES.IWebParseService).to(WebParseService).inSingletonScope();
container.bind<IDbService>(TYPES.IDbService).to(DbService).inSingletonScope();

export { container };
