import { Request, Response } from 'express';
import { interfaces, controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../IoC/types';
import { IDbService, IStation } from '../interface';

@controller('/get')
export class GetController implements interfaces.Controller {
  constructor(
    @inject(TYPES.IDbService) private dbService: IDbService,
  ) { }

  @httpGet('/stations')
  private async stations(req: Request, res: Response): Promise<IStation[]> {
    console.log(req.method, req.originalUrl, res.statusCode);
    const stations = this.dbService.getZtmStations();
    return stations;
  }
}
