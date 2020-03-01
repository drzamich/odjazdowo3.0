import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam, httpPost, requestBody, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { normalizeString } from '../utils';
import { IMatcherService } from '../interface/service/IMatcherService';
import { IDbService, IDepartureAggregator } from '../interface';
import { DepartureList } from '../schema';
import { IResponsePreparator, IResponse, IMessengerWebhookEvent, IResponseSender } from '../interface/messaging';
import { MESSENGER_TOKEN, TEST_USER_ID } from '../config';

@controller('/get')
export class GetController implements interfaces.Controller {
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
      const query = entry.messaging[0].message.text;
      const respones: IResponse[] = await this.handleQuery(senderId, 'en', query);
      respones.forEach(async response => {
        await this.responseSender.sendResponse(response);
      });
    });
  }

  @httpGet('/d/:query')
  private async platform(@requestParam('query') query: string, req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const responses = await this.handleQuery(TEST_USER_ID, undefined, query);
    res.send(responses);
    // res.send(initialResponses);
  }

  @httpGet('/allStations')
  private async allStations(req: Request, res: Response): Promise<void> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const allStations = await this.dbService.getAllStations();
    res.send(allStations);
  }

  private async handleQuery(senderId = '0', locale = 'en', query: string): Promise<IResponse[]> {
    const normalizedQuery = normalizeString(query);
    const { stations, platforms } = await this.matcherService.matchStationsAndPlatforms(normalizedQuery);
    const initialResponses: IResponse[] = this.responsePreparator.prepareInitialResponses(senderId, locale, stations, platforms);
    let departureList = new DepartureList('none', []);
    let departureResponses: IResponse[] = [];
    if (platforms.length === 1) {
      departureList = await this.departureAggregator.getDepartures(stations[0], platforms[0]);
      departureResponses = this.responsePreparator.prepareDepartureResponses(senderId, locale, departureList);
    }
    return [...initialResponses, ...departureResponses];
  }
}
