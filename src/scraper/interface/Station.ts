import Platform from './Platform';

export default interface Station {
  id: number,
  name: string,
  platforms: Platform[],
}