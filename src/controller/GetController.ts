import { Request, Response } from 'express';
import { interfaces, controller, httpGet, httpPost, requestBody, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { normalizeString } from '../utils';
import { IMatcherService } from '../interface/service/IMatcherService';
import { IDbService, IDepartureAggregator } from '../interface';
import { IResponsePreparator, IResponse, IMessengerWebhookEvent, IResponseSender } from '../interface/messaging';
import { MESSENGER_TOKEN, TEST_USER_ID } from '../config';

type senderFunction = (responses: IResponse[], isFinal?: boolean) => Promise<void>;
@controller('/get')
export class GetController implements interfaces.Controller {
  private expressResponse = undefined as unknown as Response;

  private savedResponses: IResponse[] = [];

  constructor(
    @inject(TYPES.IMatcherService) private matcherService: IMatcherService,
    @inject(TYPES.IDbService) private dbService: IDbService,
    @inject(TYPES.IDepartureAggregator) private departureAggregator: IDepartureAggregator,
    @inject(TYPES.IResponsePreparator) private responsePreparator: IResponsePreparator,
    @inject(TYPES.IResponseSender) private responseSender: IResponseSender,
  ) { }

  @httpGet('/')
  private main(req: Request, res: Response): void {
    console.log(req.method, req.originalUrl, res.statusCode);
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === MESSENGER_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.send('This is to verify messenger toekn.');
    }
  }

  @httpPost('/')
  private async handlePost(@requestBody() body: IMessengerWebhookEvent, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    body.entry.forEach(async entry => {
      const senderId = entry.messaging[0].sender.id;
      const query = entry.messaging[0].message.quick_reply?.payload || entry.messaging[0].message.text;
      console.log({ senderId, query });
      await this.handleQuery(senderId, 'en', query, this.sendResponsesToMessengerApi);
    });
  }

  @httpGet('/d/:query')
  private async platform(@requestParam('query') query: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    console.log({ query });
    this.savedResponses = [];
    this.expressResponse = res;
    await this.handleQuery(TEST_USER_ID, undefined, query, this.sendResponsesToRequestOrigin);
  }

  @httpGet('/allStations')
  private async allStations(req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const allStations = await this.dbService.getAllStations();
    res.send(allStations);
  }

  private async handleQuery(senderId = '0', locale = 'en', query: string, senderFuncion: senderFunction): Promise<void> {
    const normalizedQuery = normalizeString(query);
    const { stations, platforms } = await this.matcherService.matchStationsAndPlatforms(normalizedQuery);
    const initialResponses: IResponse[] = this.responsePreparator.prepareInitialResponses(senderId, locale, stations, platforms);
    await senderFuncion(initialResponses);
    if (platforms.length === 1) {
      const departureList = await this.departureAggregator.getDepartures(stations[0], platforms[0]);
      const departureResponses = this.responsePreparator.prepareDepartureResponses(senderId, locale, departureList);
      await senderFuncion(departureResponses, true);
    }
  }

  sendResponsesToMessengerApi = async (responses: IResponse[]): Promise<void> => {
    for (let i = 0; i < responses.length; i += 1) {
      await this.responseSender.sendResponse(responses[i]);
    }
  };

  sendResponsesToRequestOrigin = async (responses: IResponse[], isFinal?: boolean): Promise<void> => {
    const newResponses = [...this.savedResponses, ...responses];
    if (!isFinal) {
      this.savedResponses = newResponses;
    } else {
      await this.expressResponse.send(newResponses);
    }
  };
}
