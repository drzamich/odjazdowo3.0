
/* eslint-disable max-classes-per-file */
import 'reflect-metadata';
import { MatcherService } from '../service/MatcherService';
import { IDbService, IZtmStation } from '../interface';

class DbSericeMock implements IDbService {
  saveStations(station: IZtmStation[]): void {
    throw new Error('Method not implemented.');
  }

  async getAllStationNames(): Promise<any[]> {
    return [
      { _id: '5e11e094816a210d506bc920', normalizedName: '1 sierpnia' },
      { _id: '5e11e094816a210d506bc924', normalizedName: '1 praskiego pulku' },
      { _id: '5e11e094816a210d506bc929', normalizedName: '11 listopada' },
      { _id: '5e11e094816a210d506bc92c', normalizedName: 'abrahama' },
      { _id: '5e11e094816a210d506bc931', normalizedName: 'adamieckiego' },
      { _id: '5e11e094816a210d506bc934', normalizedName: 'adampolska' },
      { _id: '5e11e094816a210d506bc937', normalizedName: 'afrykanska' },
      { _id: '5e11e094816a210d506bc93a', normalizedName: 'agrykola' },
      { _id: '5e11e094816a210d506bc93d', normalizedName: 'akcent' },
      { _id: '5e11e094816a210d506bc940', normalizedName: 'al 3 maja' },
    ];
  }

  getStations(normalizedName: string): Promise<import('../schema').ZtmStation[]> {
    throw new Error('Method not implemented.');
  }

  deleteAllStations(): void {
    throw new Error('Method not implemented.');
  }
}

const dbService = new DbSericeMock();
const matcherService = new MatcherService(dbService);

describe(`${MatcherService.name}#matchStationIds`, () => {
  it('return empty list when query does not match anything', async () => {
    // given
    const query = 'asd';
    const ids: string[] = [];
    // when
    const result = await matcherService.matchStationIds(query);
    // then
    expect(result).toEqual(ids);
  });

  it('returns proper list of a single id when query matches one element', async () => {
    // given
    const query = '11 listopada';
    const ids = ['5e11e094816a210d506bc929'];
    // when
    const result = await matcherService.matchStationIds(query);
    // then
    expect(result).toEqual(ids);
  });

  it('returns proper list of a multiple ids when query matches multiple elements', async () => {
    // given
    const query = '1';
    const ids = ['5e11e094816a210d506bc920', '5e11e094816a210d506bc924', '5e11e094816a210d506bc929'];
    // when
    const result = await matcherService.matchStationIds(query);
    // then
    expect(result).toEqual(ids);
  });
});
