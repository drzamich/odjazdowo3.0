import { IDeparture } from './IDeparture';

export interface ILiveDeparture extends IDeparture {
  minutesLeft?: number;
  secondsLeft?: number;
}
