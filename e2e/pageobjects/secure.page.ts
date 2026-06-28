import { $ } from "@wdio/globals";
import Page from "./page.js";

class SecurePage extends Page {
  public get flashAlert() {
    return $("#flash");
  }
}

export default new SecurePage();
