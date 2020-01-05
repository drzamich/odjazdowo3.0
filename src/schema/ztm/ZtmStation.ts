import { IZtmStation, IZtmPlatform } from '../../interface';
import { normalizeString } from '../../utils';

export class ZtmStation implements IZtmStation {
  public normalizedName: string;

  constructor(
    public ztmId: string,
    public name: string,
    public url: string,
    public platforms: IZtmPlatform[] = [],
  ) {
    this.normalizedName = normalizeString(name);
  }
}
