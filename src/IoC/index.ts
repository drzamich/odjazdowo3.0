import { Container } from 'inversify';
import { ITimetableScrapeService, IWebFetchSerivce, IWebParseService, IDbService, IRealTimeDepartureService, IDepartureAggregator } from '../interface';
import { ZtmScrapeService, WebFetchService, WebParseService, DbService, SipTwService } from '../service';
import { TYPES } from './types';
import { DoController, GetController } from '../controller';
import { IMatcherService } from '../interface/service/IMatcherService';
import { MatcherService } from '../service/MatcherService';
import { DepartureAggregator } from '../service/DepartureAggregator';
import { IMessagePreparator, IResponsePreparator } from '../interface/response';
import { MessagePreparator } from '../response/MessagePreparator';
import { MessengerResponsePreparator } from '../response/MessengerResponsePreparator';

const container = new Container();

container.bind<DoController>(TYPES.DoController).to(DoController).inSingletonScope();
container.bind<GetController>(TYPES.DoController).to(GetController).inSingletonScope();
container.bind<ITimetableScrapeService>(TYPES.ITimetableScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IRealTimeDepartureService>(TYPES.IRealTimeDepartureService).to(SipTwService).inSingletonScope();
container.bind<IWebFetchSerivce>(TYPES.IWebFetchService).to(WebFetchService).inSingletonScope();
container.bind<IWebParseService>(TYPES.IWebParseService).to(WebParseService).inSingletonScope();
container.bind<IDbService>(TYPES.IDbService).to(DbService).inSingletonScope();
container.bind<IMatcherService>(TYPES.IMatcherService).to(MatcherService).inSingletonScope();
container.bind<IDepartureAggregator>(TYPES.IDepartureAggregator).to(DepartureAggregator).inSingletonScope();
container.bind<IMessagePreparator>(TYPES.IMessagePreparator).to(MessagePreparator);
container.bind<IResponsePreparator>(TYPES.IResponsePreparator).to(MessengerResponsePreparator);

export { container };
