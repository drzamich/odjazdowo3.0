export const normalizeString = (input: string): string => {
  let output = input.toLocaleLowerCase();
  const replacemenets = [
    {
      i: /[ąàáâäæãåā]/g,
      o: 'a',
    },
    {
      i: /[ćçč]/g,
      o: 'c',
    },
    {
      i: /[ęèéêëėē]/g,
      o: 'e',
    },
    {
      i: /[ł]/g,
      o: 'l',
    },
    {
      i: /[ńñ]/g,
      o: 'n',
    },
    {
      i: /[óôöòõœøō]/g,
      o: 'o',
    },
    {
      i: /[śš]/g,
      o: 's',
    },
    {
      i: /[żźž]/g,
      o: 'z',
    },
    {
      i: /[^\w\s]/g,
      o: ' ',
    },
    {
      i: /\s+/g,
      o: ' ',
    },
  ];
  replacemenets.forEach(({ i, o }) => {
    output = output.replace(i, o);
  });
  output = output.trim();
  return output;
};
