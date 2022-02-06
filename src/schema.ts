import { Platform, Station } from "@prisma/client";

export enum Brand {
  platform = "platform",
  station = "station",
  stationWithPlatforms = "stationWithPlatforms",
}

export type ZtmPlatform = Omit<Platform, "id"> & { __brand: Brand.platform };
export type ZtmStation = Omit<Station, "id"> & { __brand: Brand.station };
export type ZtmStationWithPlatforms = Omit<Station, "id"> & {
  platforms: ZtmPlatform[];
  __brand: Brand.stationWithPlatforms;
};

export type TableItem = ZtmPlatform | ZtmStation;
export type TableName = ZtmPlatform["__brand"] | ZtmStation["__brand"];

export const addBrand = <T, B extends Brand>(obj: T, __brand: B) => ({
  ...obj,
  __brand,
});

export type Departure = {
  line: string;
  direction: string;
  minutesLeft: number;
};

type ErrorDepartureList = {
  type: "error" | "notInSystem";
};

type ActualDepartureList = {
  type: "live" | "timetable";
  departures: Departure[];
};

export type DepartureList = ErrorDepartureList | ActualDepartureList;

// {
//   const lines = this.departures.map(departure => {
//     const { line, direction } = departure;
//     const minutes = departure.getMinutesToDeparture();
//     return `${line} | ${direction} | ${minutes}`;
//   });
//   return lines.join('\n');
// }
