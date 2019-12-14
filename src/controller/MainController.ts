import { Request, Response } from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';

@controller('/')
export class MainController implements interfaces.Controller {
  @httpGet('/')
  private index(req: Request, res: Response): void {
    res.send('I AM THE BOT');
  }
}
