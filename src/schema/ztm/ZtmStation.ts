import { IZtmStation } from '../../interface';

export class ZtmStation implements IZtmStation {
  public platforms = [];

  constructor(
    public id: string,
    public name: string,
    public url: string,
  ) {}
}
