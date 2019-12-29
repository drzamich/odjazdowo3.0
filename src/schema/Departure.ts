import { IDeparture } from '../interface';

export class Departure implements IDeparture {
  constructor(public line: string, public direction: string, public time: Date) {}
}
