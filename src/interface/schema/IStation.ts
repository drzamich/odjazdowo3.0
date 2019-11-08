import { IPlatform } from './IPlatform';

export interface IStation {
  id: number;
  name: string;
  platforms: IPlatform[];
}
