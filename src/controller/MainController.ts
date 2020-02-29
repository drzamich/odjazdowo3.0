import { Request, Response } from 'express';
import { interfaces, controller, httpGet, queryParam } from 'inversify-express-utils';
import { MONGODB_URI, TOKEN } from '../config';

@controller('/')
export class MainController implements interfaces.Controller {
  @httpGet('/')
  private async main(req: Request, res: Response): Promise<void> {
    res.send('Odjazdowo works!');
  }

  @httpGet('mongodburi')
  private async settings(@queryParam('token') token: string, req: Request, res: Response): Promise<void> {
    if (token === TOKEN) {
      res.send({ MONGODB_URI });
    } else {
      res.send('Access denied.');
    }
  }
}
