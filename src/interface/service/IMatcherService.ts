import { IPlatform, IStation } from '../schema';

export interface IMatcherService {
  matchStationsAndPlatforms(query: string): Promise<IMatcherResponse>;
}

export interface IMatcherResponse {
  stations: IStation[];
  platforms: IPlatform[];
}
