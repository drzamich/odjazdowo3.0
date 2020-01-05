import { normalizeString } from '../utils';

describe('normalizeString()', () => {
  it('returns string in lowercase', () => {
    // given
    const inputs = [
      'Małymi-Jak-I-Wielkimii?? ',
      'ĄŁÓ  !!. źle"?',
      'Pl. Jana Pawła 2',
      '; DROP DATABASE',
      '1.Praskiego Pułku',
      'al."Solidarności',
      'P+R Al.Krakowska',
      'Praga-Płd.-Ratusz',
      'Żywiecka',
    ];
    const outputs = [
      'malymi jak i wielkimii',
      'alo zle',
      'pl jana pawla 2',
      'drop database',
      '1 praskiego pulku',
      'al solidarnosci',
      'p r al krakowska',
      'praga pld ratusz',
      'zywiecka',
    ];
    // when
    // then
    inputs.forEach((input, index) => {
      expect(normalizeString(input)).toEqual(outputs[index]);
    });
  });
});
