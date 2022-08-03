import { DbService } from "./DbService";
import { MatcherService } from "./MatcherService";
import { centrumStation, otherStationsWithCentrumInName } from "./mocks";

describe("MatcherService", () => {
  describe("when being passed a query with exact name of existing station", () => {
    class MockDBService implements DbService {
      async findStationsByName(name: string) {
        return [centrumStation, ...otherStationsWithCentrumInName];
      }
    }

    const matcherService = new MatcherService(new MockDBService());

    it("returns `manyPlatformsFound` when query doesn't include platform number", async () => {
      const result = await matcherService.matchStationsAndPlatforms("centrum");
      expect(result.type).toBe("manyPlatformsFound");
    });

    it("returns `exactMatch` when query includes existing platform number", async () => {
      const result = await matcherService.matchStationsAndPlatforms(
        "centrum 5"
      );
      expect(result.type).toBe("exactMatch");
    });

    it("returns `manyPlatformsFound` when query includes platform number that doesn't exist", async () => {
      const result = await matcherService.matchStationsAndPlatforms(
        "centrum 71"
      );
      expect(result.type).toBe("manyPlatformsFound");
    });
  });
});
