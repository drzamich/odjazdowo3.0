export interface IHttpService {
  get<T>(url: string): Promise<T>;
  post(url: string, body: object): void;
}
