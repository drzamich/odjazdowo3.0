export interface IDeparture {
  line: string;
  direction: string;
  getMinutesToDeparture(): number;
}
