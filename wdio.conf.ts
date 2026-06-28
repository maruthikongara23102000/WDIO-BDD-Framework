import {
  beforeHook,
  afterHook,
  beforeScenarioHook,
  afterScenarioHook,
  onCompleteHook,
} from "./e2e/hooks/wdio.hooks.js";

export const config: WebdriverIO.Config = {
  runner: "local",
  tsConfigPath: "./tsconfig.json",
  specs: ["./e2e/features/**/*.feature"],
  exclude: [],
  maxInstances: 1,
  capabilities: [{ browserName: "chrome" }],
  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "cucumber",
  reporters: ["spec"],
  cucumberOpts: {
    require: ["./e2e/step-definitions/steps.ts"],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression: "",
    timeout: 60000,
    ignoreUndefinedDefinitions: false,
  },
  before: beforeHook,
  after: afterHook,
  beforeScenario: beforeScenarioHook,
  afterScenario: afterScenarioHook,
  onComplete: onCompleteHook,
};

export default config;
