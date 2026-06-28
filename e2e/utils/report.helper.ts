import path from "node:path";
import { FileHelper } from "./file.helper.js";

type ScenarioExecution = {
  feature: string;
  scenario: string;
  status: "passed" | "failed" | "skipped" | "pending";
  tags: string[];
  duration: string;
  screenshot?: string;
};

type ReportSummary = {
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  pending: number;
  scenarios: ScenarioExecution[];
};

export class ReportHelper {
  public static async generate(scenarios: ScenarioExecution[]): Promise<void> {
    const reportDir = path.resolve(process.cwd(), "e2e/reports");
    await FileHelper.ensureDir(reportDir);

    const timestamp = FileHelper.getTimestamp();
    const summary: ReportSummary = {
      timestamp,
      total: scenarios.length,
      passed: scenarios.filter((scenario) => scenario.status === "passed")
        .length,
      failed: scenarios.filter((scenario) => scenario.status === "failed")
        .length,
      skipped: scenarios.filter((scenario) => scenario.status === "skipped")
        .length,
      pending: scenarios.filter((scenario) => scenario.status === "pending")
        .length,
      scenarios,
    };

    const reportJsonPath = path.join(
      reportDir,
      `cucumber-report-${timestamp}.json`,
    );
    const reportHtmlPath = path.join(
      reportDir,
      `cucumber-report-${timestamp}.html`,
    );
    const latestJsonPath = path.join(reportDir, "latest-report.json");
    const latestHtmlPath = path.join(reportDir, "latest-report.html");

    await FileHelper.writeJson(reportJsonPath, summary);
    await FileHelper.writeJson(latestJsonPath, summary);
    await FileHelper.writeText(reportHtmlPath, this.buildHtml(summary));
    await FileHelper.writeText(latestHtmlPath, this.buildHtml(summary));
  }

  private static buildHtml(summary: ReportSummary): string {
    const rows = summary.scenarios.length
      ? summary.scenarios
          .map((scenario) => {
            const badgeClass = scenario.status === "passed" ? "pass" : "fail";
            const tags = scenario.tags.length
              ? scenario.tags
                  .map(
                    (tag) => `<span class="tag">${this.escapeHtml(tag)}</span>`,
                  )
                  .join("")
              : '<span class="tag">none</span>';
            const screenshot = scenario.screenshot
              ? `<a href="../screenshots/${path.basename(scenario.screenshot)}" target="_blank">Screenshot</a>`
              : "—";

            return `
              <tr>
                <td>${this.escapeHtml(scenario.feature)}</td>
                <td>${this.escapeHtml(scenario.scenario)}</td>
                <td><span class="badge ${badgeClass}">${this.escapeHtml(scenario.status)}</span></td>
                <td>${tags}</td>
                <td>${this.escapeHtml(scenario.duration)}</td>
                <td>${screenshot}</td>
              </tr>`;
          })
          .join("")
      : '<tr><td colspan="6">No scenarios were executed.</td></tr>';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cucumber Execution Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; background: #f7f9fc; color: #1f2937; }
      .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
      .card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
      .badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
      .pass { background: #dcfce7; color: #166534; }
      .fail { background: #fee2e2; color: #b91c1c; }
      table { width: 100%; border-collapse: collapse; background: white; }
      th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
      th { background: #f3f4f6; }
      .tag { display: inline-block; margin-right: 0.35rem; padding: 0.2rem 0.45rem; border-radius: 999px; background: #e0f2fe; color: #075985; font-size: 0.75rem; }
    </style>
  </head>
  <body>
    <h1>Cucumber Execution Report</h1>
    <p><strong>Timestamp:</strong> ${this.escapeHtml(summary.timestamp)}</p>
    <div class="summary">
      <div class="card"><strong>Total</strong><br />${summary.total}</div>
      <div class="card"><strong>Passed</strong><br /><span class="badge pass">${summary.passed}</span></div>
      <div class="card"><strong>Failed</strong><br /><span class="badge fail">${summary.failed}</span></div>
      <div class="card"><strong>Skipped</strong><br />${summary.skipped}</div>
      <div class="card"><strong>Pending</strong><br />${summary.pending}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Scenario</th>
          <th>Status</th>
          <th>Tags</th>
          <th>Duration</th>
          <th>Artifacts</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>`;
  }

  private static escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
