import { Given, When, Then } from "@wdio/cucumber-framework";
import { expect } from "@wdio/globals";
import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";
import { EnvironmentHelper } from "../utils/environment.helper.js";
import {
  FAILED_LOGIN_MESSAGE,
  SUCCESSFUL_LOGIN_MESSAGE,
} from "../constants/app.constants.js";

const pages = {
  login: LoginPage,
};

Given(/^I am on the (\w+) page$/, async (page: string) => {
  await pages[page as keyof typeof pages].open();
});

When(
  /^I login with (\w+) and (.+)$/,
  async (username: string, password: string) => {
    const loginUsername = username || EnvironmentHelper.getUsername();
    const loginPassword = password || EnvironmentHelper.getPassword();
    await LoginPage.login(loginUsername, loginPassword);
  },
);

Then(/^I should see a flash message saying (.*)$/, async (message: string) => {
  await expect(SecurePage.flashAlert).toBeExisting();
  await expect(SecurePage.flashAlert).toHaveText(
    expect.stringContaining(message),
  );
});

Then(/^I should see a valid login message$/, async () => {
  await expect(SecurePage.flashAlert).toHaveText(
    expect.stringContaining(SUCCESSFUL_LOGIN_MESSAGE),
  );
});

Then(/^I should see an invalid login message$/, async () => {
  await expect(SecurePage.flashAlert).toHaveText(
    expect.stringContaining(FAILED_LOGIN_MESSAGE),
  );
});

Given(/^I am running a simple test$/, async () => {
  console.log("Running a simple test");
});
