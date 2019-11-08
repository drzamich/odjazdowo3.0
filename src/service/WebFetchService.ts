import axios from 'axios';
import { injectable } from 'inversify';

import { IWebFetchSerivce } from '../interface';

@injectable()
export class WebFetchService implements IWebFetchSerivce {
  public async get<T>(url: string): Promise<T> {
    const response = await axios.get(url);
    return response.data;
  }
}
