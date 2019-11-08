import Platform from './IPlatform';

export default interface IStation {
  id: number;
  name: string;
  platforms: Platform[];
}
