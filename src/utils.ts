import { ZtmPlatform, ZtmStationWithPlatforms } from "./schema";

export const normalizeString = (input: string): string => {
  let output = input.toLocaleLowerCase();
  const replacements = [
    {
      i: /[ąàáâäæãåā]/g,
      o: "a",
    },
    {
      i: /[ćçč]/g,
      o: "c",
    },
    {
      i: /[ęèéêëėē]/g,
      o: "e",
    },
    {
      i: /[ł]/g,
      o: "l",
    },
    {
      i: /[ńñ]/g,
      o: "n",
    },
    {
      i: /[óôöòõœøō]/g,
      o: "o",
    },
    {
      i: /[śš]/g,
      o: "s",
    },
    {
      i: /[żźž]/g,
      o: "z",
    },
    {
      i: /[^\w\s]/g,
      o: " ",
    },
    {
      i: /\s+/g,
      o: " ",
    },
  ];
  replacements.forEach(({ i, o }) => {
    output = output.replace(i, o);
  });
  output = output.trim();
  return output;
};

export const getLastWord = (str: string) => str.slice(-1);

export const isNumeric = (str: string) => !Number.isNaN(Number(str));

export const trimLastWord = (query: string) => {
  return query.split(" ").slice(undefined, -1).join(" ");
};

export const removeBrand = <T extends { __brand: string }>(obj: T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __brand, ...rest } = obj;
  return rest;
};

export const encodeStationAndPlatformToQuickReply = (
  station: ZtmStationWithPlatforms,
  platform: ZtmPlatform
) =>
  `QR:${JSON.stringify({
    station: { ...station, platforms: 0 },
    platform,
  })}`;

export const decodeStationAndPlatformFromQuickReply = (query: string) =>
  JSON.parse(query.replace("QR:", "")) as {
    station: ZtmStationWithPlatforms;
    platform: ZtmPlatform;
  };
