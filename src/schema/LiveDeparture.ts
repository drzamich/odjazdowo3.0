import { ILiveDeparture } from '../interface';

export class LiveDeparture implements ILiveDeparture {
  constructor(
    public line: string,
    public direction: string,
    public minutesLeft: number,
  ) {}

  getMinutesToDeparture(): number {
    return this.minutesLeft;
  }
}
