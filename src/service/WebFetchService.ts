import axios from 'axios';
import { injectable } from 'inversify';

import { IWebFetchSerivce } from '../interface';

@injectable()
export class WebFetchService implements IWebFetchSerivce {
  public async get<T>(url: string): Promise<T> {
    const response = await axios.get(url)
      .then(res => res.data)
      .catch(error => {
        if (error.response) {
          console.log(`Error when fetching ${url}. Server responsed with status code ${error.response.status}`);
          console.log(error.response.data);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(`Error when fetching ${url}. There was no response from the server.`);
          console.log(error.request);
        } else {
          console.log(`Error when fetching ${url}. ${error.message}`);
        }
        console.log(error.config);
        return null;
      });
    return response;
  }
}
