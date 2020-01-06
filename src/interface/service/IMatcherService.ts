import { IPlatform, IStation } from '../schema';

export interface IMatcherService {
  matchStationOrPlatform(normalizedName: string): Promise<IStation[]> | Promise<IPlatform[]>;
}
