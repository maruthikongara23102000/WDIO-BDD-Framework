import "../config/environment.js";

export class EnvironmentHelper {
  public static getBaseUrl(): string {
    return process.env.BASE_URL?.trim() || "https://the-internet.herokuapp.com";
  }

  public static getUsername(): string {
    return process.env.USERNAME?.trim() || "tomsmith";
  }

  public static getPassword(): string {
    return process.env.PASSWORD?.trim() || "SuperSecretPassword!";
  }
}
