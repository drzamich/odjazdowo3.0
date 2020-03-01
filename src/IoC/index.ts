import { Container } from 'inversify';
import { ITimetableScrapeService, IHttpService, IWebParseService, IDbService, IRealTimeDepartureService, IDepartureAggregator } from '../interface';
import { ZtmScrapeService, HttpService, WebParseService, DbService, SipTwService } from '../service';
import { TYPES } from './types';
import { DoController, GetController, MainController } from '../controller';
import { IMatcherService } from '../interface/service/IMatcherService';
import { MatcherService } from '../service/MatcherService';
import { DepartureAggregator } from '../service/DepartureAggregator';
import { IMessagePreparator, IResponsePreparator, IResponseSender } from '../interface/messaging';
import { MessagePreparator } from '../response/MessagePreparator';
import { MessengerResponsePreparator } from '../response/MessengerResponsePreparator';
import { MessengerResponseSender } from '../response/MessengerResponseSender';

const container = new Container();

container.bind<DoController>(TYPES.DoController).to(DoController).inSingletonScope();
container.bind<GetController>(TYPES.GetController).to(GetController).inSingletonScope();
container.bind<MainController>(TYPES.MainController).to(MainController).inSingletonScope();
container.bind<ITimetableScrapeService>(TYPES.ITimetableScrapeService).to(ZtmScrapeService).inSingletonScope();
container.bind<IRealTimeDepartureService>(TYPES.IRealTimeDepartureService).to(SipTwService).inSingletonScope();
container.bind<IHttpService>(TYPES.IHttpService).to(HttpService).inSingletonScope();
container.bind<IWebParseService>(TYPES.IWebParseService).to(WebParseService).inSingletonScope();
container.bind<IDbService>(TYPES.IDbService).to(DbService).inSingletonScope();
container.bind<IMatcherService>(TYPES.IMatcherService).to(MatcherService).inSingletonScope();
container.bind<IDepartureAggregator>(TYPES.IDepartureAggregator).to(DepartureAggregator).inSingletonScope();
container.bind<IMessagePreparator>(TYPES.IMessagePreparator).to(MessagePreparator);
container.bind<IResponsePreparator>(TYPES.IResponsePreparator).to(MessengerResponsePreparator);
container.bind<IResponseSender>(TYPES.IResponseSender).to(MessengerResponseSender);

export { container };
