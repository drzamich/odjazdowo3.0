import { IStrings } from '../interface/messaging';

const pl: IStrings = {
  station_not_found: 'Nie znaleziono stacji.',
  departures_not_available: 'Błąd podczas wczytywania odjazdów',
  timetable: 'Rozkład',
  platform_not_found: 'Nie znaleziono peronu',
  no_close_departures: 'Brak odjazdów w najbliższym czasie',
  multiple_stations_found: 'Znaleziono wiele stacji',
  multiple_platforms_found: 'Znaleziono wiele peronów',
  live: 'Live',
  choose_one_platform: 'Wybierz peron',
  choose_one_station: 'Wybierz stację',
  try_again: 'Spróbuj ponownie',
  departures_for: 'Odjazdy dla:',
  direction_short: 'kier.',
  platform: 'peron',
};

const en: IStrings = {
  station_not_found: 'Station not found.',
  departures_not_available: 'Error while loading departures.',
  timetable: 'Timetable',
  platform_not_found: 'Platform not found',
  no_close_departures: 'No departures in the nearest future.',
  multiple_stations_found: 'Multiple stations found.',
  multiple_platforms_found: 'Multiple platforms found.',
  live: 'Live',
  choose_one_platform: 'Choose the platform',
  choose_one_station: 'Choose the station',
  try_again: 'Try again',
  departures_for: 'Departures for:',
  direction_short: 'dir.',
  platform: 'paltform',
};

export const strings = {
  pl, en,
};
