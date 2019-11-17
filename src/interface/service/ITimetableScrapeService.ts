import { IStation } from '../schema/general/IStation';

export interface ITimetableScrapeService {
  scapeTimetable(): Promise<IStation[]>;
}
