import { browser } from "@wdio/globals";
import path from "node:path";
import { rm } from "node:fs/promises";
import { ScreenshotHelper } from "../utils/screenshot.helper.js";
import { FileHelper } from "../utils/file.helper.js";
import { ReportHelper } from "../utils/report.helper.js";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root
const projectRoot = path.resolve(__dirname, "../..");

const reportDir = path.join(projectRoot, "e2e", "reports");
const logsDir = path.join(projectRoot, "e2e", "logs");
const scenariosFilePath = path.join(
  projectRoot,
  "e2e",
  "reports",
  ".scenarios.json",
);

type ScenarioExecution = {
  feature: string;
  scenario: string;
  status: "passed" | "failed" | "skipped" | "pending";
  tags: string[];
  duration: string;
  screenshot?: string;
};

// Keep in-memory copy for immediate access
let scenarioExecutions: ScenarioExecution[] = [];

function sanitizeName(value: string): string {
  return value.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}

async function loadScenarios(): Promise<ScenarioExecution[]> {
  try {
    const content = await FileHelper.readJson(scenariosFilePath);
    return Array.isArray(content) ? content : [];
  } catch {
    return [];
  }
}

async function saveScenarios(scenarios: ScenarioExecution[]): Promise<void> {
  await FileHelper.writeJson(scenariosFilePath, scenarios);
}

export async function beforeHook(): Promise<void> {
  scenarioExecutions = [];
  await FileHelper.ensureDir(reportDir, logsDir);
  // Initialize scenarios file
  await FileHelper.writeJson(scenariosFilePath, []);
  console.log("[Report] Initialized report generation");
  // Clear old reports
  try {
    const files = await FileHelper.readDir(reportDir);
    for (const file of files) {
      if (file.startsWith("cucumber-report-") && file.endsWith(".json")) {
        await rm(path.join(reportDir, file), { force: true });
        const htmlFile = file.replace(".json", ".html");
        await rm(path.join(reportDir, htmlFile), { force: true });
      }
    }
    console.log("[Report] Cleaned up old reports");
  } catch (err) {
    // Directory might not exist yet, which is fine
  }
}

export async function beforeScenarioHook(): Promise<void> {
  await browser.deleteCookies();
}

export async function afterScenarioHook(
  world: unknown,
  result: unknown,
): Promise<void> {
  try {
    const worldData = world as {
      pickle?: { name?: string; tags?: Array<{ name?: string }> };
      gherkinDocument?: { feature?: { name?: string } };
    };
    const resultData = result as
      | { passed?: boolean; duration?: number }
      | undefined;

    const scenarioName = worldData?.pickle?.name || "scenario";
    const featureName =
      worldData?.gherkinDocument?.feature?.name || "Unknown Feature";
    const tags = (worldData?.pickle?.tags || [])
      .map((tag) => tag?.name || "")
      .filter(Boolean);
    const status = resultData?.passed ? "passed" : "failed";

    let screenshotPath: string | undefined;
    if (!resultData?.passed) {
      screenshotPath = await ScreenshotHelper.capture(
        `scenario-failure-${sanitizeName(scenarioName)}`,
      );
      await FileHelper.appendText(
        path.join(logsDir, "execution.log"),
        `Scenario failed: ${scenarioName} -> ${screenshotPath}\n`,
      );
    }

    scenarioExecutions.push({
      feature: featureName,
      scenario: scenarioName,
      status,
      tags,
      duration: `${resultData?.duration ?? 0}ms`,
      screenshot: screenshotPath,
    });

    // Save scenarios to file for cross-process access
    await saveScenarios(scenarioExecutions);

    console.log(
      `[Report] Scenario recorded: ${scenarioName} (${status}) - Total: ${scenarioExecutions.length}`,
    );
  } catch (error) {
    console.error("[Report] Error in afterScenarioHook:", error);
  }
}

export async function afterHook(): Promise<void> {
  console.log(
    `[Report] afterHook called: ${scenarioExecutions.length} scenarios`,
  );
  await FileHelper.appendText(
    path.join(logsDir, "execution.log"),
    `Execution completed with ${scenarioExecutions.length} scenarios\n`,
  );
}

export async function onCompleteHook(): Promise<void> {
  // Load scenarios from file (they may have been saved by a different process)
  const allScenarios = await loadScenarios();
  console.log(
    `[Report] onCompleteHook: loaded ${allScenarios.length} scenarios from file`,
  );
  await ReportHelper.generate(allScenarios);
}
