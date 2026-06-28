import {
  appendFile,
  mkdir,
  readFile,
  writeFile,
  readdir,
} from "node:fs/promises";
import path from "node:path";

export class FileHelper {
  public static async ensureDir(...directories: string[]): Promise<void> {
    for (const directory of directories) {
      await mkdir(directory, { recursive: true });
    }
  }

  public static async readDir(directory: string): Promise<string[]> {
    try {
      return await readdir(directory);
    } catch (error) {
      return [];
    }
  }

  public static async writeText(
    filePath: string,
    content: string,
  ): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    await writeFile(filePath, content, "utf8");
  }

  public static async appendText(
    filePath: string,
    content: string,
  ): Promise<void> {
    await this.ensureDir(path.dirname(filePath));
    await appendFile(filePath, content, "utf8");
  }

  public static async writeJson(
    filePath: string,
    data: unknown,
  ): Promise<void> {
    await this.writeText(filePath, JSON.stringify(data, null, 2));
  }

  public static async readJson<T>(filePath: string): Promise<T> {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  }

  public static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, "-");
  }
}
