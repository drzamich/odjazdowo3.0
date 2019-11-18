import { IPlatform } from './IPlatform';

export interface IStation {
  id: string;
  name: string;
  platforms: IPlatform[];
}
