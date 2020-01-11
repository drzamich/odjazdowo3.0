
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { MatcherService } from '../service/MatcherService';
import { IDbService, IZtmStation } from '../interface';
import { ztmStations } from './mocks/ztmStations';

class DbSericeMock implements IDbService {
  getStationById(ztmId: string): Promise<IZtmStation[]> {
    const station = ztmStations.find(st => st.ztmId === ztmId);
    const result = station ? [station] : [];
    return Promise.resolve(result);
  }

  saveStations(): void {
    throw new Error('Method not implemented.');
  }

  getAllStations(): Promise<IZtmStation[]> {
    return Promise.resolve(ztmStations);
  }

  deleteAllStations(): void {
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

  it('returns multiple stations and no platforms when query is not super precise', async () => {
    // given
    const query = 'al maja';
    // when
    const { stations, platforms } = await matcherService.matchStationsAndPlatforms(query);
    // then
    expect(stations).toHaveLength(2);
    expect(stations[0].normalizedName).toEqual('al 3 maja');
    expect(stations[1].normalizedName).toEqual('al 10 maja');
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
});
