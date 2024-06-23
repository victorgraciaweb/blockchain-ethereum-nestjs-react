import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { FileNotFoundException } from "./exceptions/file-not-found.exception";

@Injectable()
export class FileService {
  async readFile<T>(filePath: string): Promise<T> {
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      const networks = JSON.parse(fileContent);
      return networks;
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new FileNotFoundException(`File not found at ${filePath}`);
      }
      throw error;
    }
  }
}
