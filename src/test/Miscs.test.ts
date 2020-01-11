import moment from 'moment';
import Fuse from 'fuse.js';
import { stringify } from 'querystring';

describe('moment.js', () => {
  it('moment gives proper date format', () => {
    // given
    const expectedDate = '2019-12-29';
    const format = 'YYYY-MM-DD';
    // when
    const formattedDate = moment(1577637772171).format(format);
    // then
    expect(formattedDate).toEqual(expectedDate);
  });
});


describe('fuse.js', () => {
  interface StationNameWithId {
    _id: string;
    normalizedName: string;
  }

  const list: StationNameWithId[] = [
    { _id: '6e11e094816a210d506bc920', normalizedName: '1 sierp' },
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
    { _id: '5e11e09481asd10d506bc940', normalizedName: 'al 1 maja' },
  ];

  it('produces a result', () => {
    // given
    const options: Fuse.FuseOptions<StationNameWithId> = {
      shouldSort: true,
      includeScore: true,
      includeMatches: false,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'normalizedName',
      ],
    };
    const query = '1 sierpnia';
    // when
    const fuse = new Fuse(list, options);
    const result = fuse.search(query) as Fuse.FuseResultWithScore<StationNameWithId>[];
    // then
    expect(result).toHaveLength(2);
    expect(result[0].item.normalizedName).toEqual('1 sierpnia');
  });
});
