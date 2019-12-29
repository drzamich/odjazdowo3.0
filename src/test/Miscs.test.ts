import moment from 'moment';

describe('Misc', () => {
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
