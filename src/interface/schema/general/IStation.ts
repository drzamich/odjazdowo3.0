import { IPlatform } from './IPlatform';

export interface IStation {
  name: string;
  normalizedName: string;
  platforms: IPlatform[];
}
