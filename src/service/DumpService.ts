import { writeFileSync, readFileSync } from "fs";
import { TableItem, TableName } from "../schema";

const BASE_PATH = "data/";

export class DumpService {
  saveToJSONFile(items: TableItem[]) {
    const tableName = items[0].__brand;
    const path = this.getFilePath(tableName);

    try {
      const json = JSON.stringify(items);
      writeFileSync(path, json);
      console.log(`${tableName} saved succesfully to ${path}`);
    } catch (e) {
      console.error(e);
      console.error(`Error when saving ${path} file.`);
    }
  }

  loadFromJSONFIle(table: TableName): TableItem[] {
    const path = this.getFilePath(table);
    try {
      const file = readFileSync(path);
      const items = JSON.parse(String(file)) as TableItem[];
      return items;
    } catch (e) {
      console.error(e);
      console.error(`Error when saving ${path} file.`);
      return [];
    }
  }

  getFilePath(filename: string) {
    return `${BASE_PATH}${filename}.json`;
  }
}
