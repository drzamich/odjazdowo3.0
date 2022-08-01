import axios, { AxiosError } from "axios";

export interface IHttpService {
  get<T>(url: string): Promise<T>;
}

export class HttpService implements IHttpService {
  public async get<T>(url: string): Promise<T> {
    return await axios
      .get(url)
      .then((response) => response.data)
      .catch((error: Error | AxiosError) => {
        console.log(`Error when querying ${url}. ${error.message}`);
      });
  }
}
