import { $ } from "@wdio/globals";
import Page from "./page.js";
import { LOGIN_PATH } from "../constants/app.constants.js";

class LoginPage extends Page {
  public get inputUsername() {
    return $("#username");
  }

  public get inputPassword() {
    return $("#password");
  }

  public get btnSubmit() {
    return $('button[type="submit"]');
  }

  public async login(username: string, password: string): Promise<void> {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  public override async open(): Promise<void> {
    await super.open(LOGIN_PATH);
  }
}

export default new LoginPage();
