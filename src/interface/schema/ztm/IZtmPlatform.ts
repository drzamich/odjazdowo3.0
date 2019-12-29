import { IPlatform } from '../general/IPlatform';

export interface IZtmPlatform extends IPlatform {
  url: string;
  isInSipTw: boolean;
}
