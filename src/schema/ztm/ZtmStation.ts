import { IZtmStation, IZtmPlatform } from '../../interface';

export class ZtmStation implements IZtmStation {
  constructor(
    public ztmId: string,
    public name: string,
    public url: string,
    public platforms: IZtmPlatform[] = [],
  ) {}
}
