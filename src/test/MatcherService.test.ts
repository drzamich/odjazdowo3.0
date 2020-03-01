
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { MatcherService, MAX_MATCHED_STATIONS } from '../service/MatcherService';
import { IDbService, IZtmStation } from '../interface';
import ztmStations from './mocks/ztmStations';

class DbSericeMock implements IDbService {
  getStationById(ztmId: string): Promise<IZtmStation[]> {
    const station = ztmStations.find(st => st.ztmId === ztmId);
    const result = station ? [station] : [];
    return Promise.resolve(result);
  }

  async saveStations(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getAllStations(): Promise<IZtmStation[]> {
    return Promise.resolve(ztmStations);
  }

  async deleteAllStations(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

const dbService = new DbSericeMock();
const matcherService = new MatcherService(dbService);

describe(MatcherService.name, () => {
  it('returns empty lists when query does not match anything', async () => {
    // given
    const query = 'siabadabada';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(0);
    expect(platforms).toHaveLength(0);
  });

  it('returns single station and all its platforms when a query is precise', async () => {
    // given
    const query = '1 sierpnia';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(1);
    expect(platforms).toHaveLength(3);
  });

  it('returns limited number of suggestions when query is not suepr precise', async () => {
    // given
    const query = 'al maja';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    const stationNames = stations.map(({ name }) => name);
    // then
    expect(stationNames).toHaveLength(MAX_MATCHED_STATIONS);
    expect(stations[0].normalizedName).toEqual('al 3 maja');
    expect(platforms).toHaveLength(0);
  });

  it('returns a station and specific platform when query is specific', async () => {
    // given
    const query = 'al 3 maja 01';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(1);
    expect(stations[0].normalizedName).toEqual('al 3 maja');
    expect(platforms).toHaveLength(1);
    expect(platforms[0].direction).toEqual('Ludna');
  });

  it('returns a station and all platforms when platform number is wrong', async () => {
    // given
    const query = 'al 3 maja 101';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(1);
    expect(stations[0].normalizedName).toEqual('al 3 maja');
    expect(platforms).toHaveLength(2);
  });

  it('returns a station and all platforms when user typed direction instead of platform number', async () => {
    // given
    const query = 'al 3 maja polnoc';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(1);
    expect(stations[0].normalizedName).toEqual('al 3 maja');
    expect(platforms).toHaveLength(2);
  });

  it('returns just `Muranow` when query is `Muranow`', async () => {
    // given
    const query = 'muranow';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    const stationNames = stations.map(({ name }) => name);
    expect(stationNames).toHaveLength(1);
    expect(stationNames[0]).toEqual('Muranów');
  });

  it.only('returns proper station and platform `Muranow 06` when query is `Muranow 06`', async () => {
    // given
    const query = 'muranow 06';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    const stationNames = stations.map(({ name }) => name);
    expect(stationNames).toHaveLength(1);
    expect(stationNames[0]).toEqual('Muranów');
  });
});
