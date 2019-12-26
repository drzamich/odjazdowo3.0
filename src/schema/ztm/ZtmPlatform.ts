import { IZtmPlatform, IDeparture } from '../../interface';

export class ZtmPlatform implements IZtmPlatform {
  public departures: IDeparture[] = [];

  constructor(
    public plNumber: string,
    public direction: string,
    public url: string,
    public isInSipTw: boolean = false,
  ) {}
}
