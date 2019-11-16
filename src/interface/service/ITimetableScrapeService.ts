export interface ITimetableScrapeService {
  scapeTimetable(): Promise<IStation[]>;
}
