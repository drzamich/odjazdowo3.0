export interface IHttpService {
  get(url: string): Promise<unknown>;
}

export class HttpService implements IHttpService {
  public async get(url: string): Promise<unknown> {
    const res = await fetch(url);
    return await res.json();
  }
}
