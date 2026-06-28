import { browser } from "@wdio/globals";
import { EnvironmentHelper } from "../utils/environment.helper.js";
import { LOGIN_PATH } from "../constants/app.constants.js";

export default class Page {
  public async open(path: string = LOGIN_PATH): Promise<void> {
    const baseUrl = EnvironmentHelper.getBaseUrl();
    await browser.url(`${baseUrl}${path}`);
  }
}
