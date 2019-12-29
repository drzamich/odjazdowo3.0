import { Container } from 'inversify';
import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IDbService, IRealTimeDepartureService } from '../interface';
import { ZtmScrapeService, WebFetchService, WebParseService, DbService, SipTwService } from '../service';
import { TYPES } from './types';
import { DoController, GetController } from '../controller';

const container = new Container();

container.bind<DoController>(TYPES.DoController).to(DoController).inSingletonScope();
container.bind<GetController>(TYPES.DoController).to(GetController).inSingletonScope();
container.bind<ITimetableScrapeService>(TYPES.ITimetableScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IRealTimeDepartureService>(TYPES.IRealTimeDepartureService).to(SipTwService).inSingletonScope();
container.bind<IWebFetchSerivce>(TYPES.IWebFetchService).to(WebFetchService).inSingletonScope();
container.bind<IWebParseService>(TYPES.IWebParseService).to(WebParseService).inSingletonScope();
container.bind<IDbService>(TYPES.IDbService).to(DbService).inSingletonScope();

export { container };
