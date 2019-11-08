export interface IWebFetchSerivce {
  get<T>(url: string): Promise<T>;
}
