import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { browser } from "@wdio/globals";

export class ScreenshotHelper {
  public static async capture(name: string): Promise<string> {
    const screenshotDir = path.resolve(process.cwd(), "e2e/screenshots");
    await mkdir(screenshotDir, { recursive: true });
    const filePath = path.join(screenshotDir, `${name}-${Date.now()}.png`);
    const screenshot = await browser.takeScreenshot();
    await writeFile(filePath, screenshot, "base64");
    return filePath;
  }
}
