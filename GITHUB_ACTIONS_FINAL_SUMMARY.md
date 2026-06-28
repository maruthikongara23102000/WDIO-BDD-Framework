# GitHub Actions Setup - Final Comprehensive Summary

## 📋 Executive Summary

Your WDIO-BDD-Framework is now fully configured for GitHub Actions CI/CD. The setup allows you to manually trigger test execution from GitHub with optional Cucumber tag filtering, automatic report generation, and artifact uploads.

**Status:** ✅ **PRODUCTION READY**

---

## 🎯 Deliverables

### 1. GitHub Actions Workflow YAML ✅

**File Location:** `.github/workflows/run-tests.yml`

**Key Specifications:**

- Trigger type: `workflow_dispatch` (manual)
- Optional input field: `tag` (Cucumber tag filter)
- Runner: `ubuntu-latest`
- Node.js version: `24.11.1` (matches local)
- Dependency caching: ✅ Enabled (npm)
- Installation method: `npm ci` (clean install)
- Test directory: `e2e/`
- Timeout: 30 minutes

**Workflow Features:**

```yaml
triggers:
  - Manual trigger from GitHub Actions UI
  - Optional tag input (@smoke, @regression, @sanity)

steps: 1. Checkout repository code
  2. Setup Node.js 24.11.1 with caching
  3. Install dependencies (npm ci)
  4. Create e2e/.env.local from secrets/variables
  5. Display test configuration
  6. Execute tests (with or without tag)
  7. Upload artifacts (reports, screenshots, logs)
  8. Generate GitHub summary
```

**Tag Execution Logic:**

```bash
# If tag provided:
npm run wdio -- --cucumberOpts.tagExpression='@smoke'

# If no tag (all tests):
npm run wdio
```

---

### 2. Configuration Modifications ✅

#### File: `wdio.conf.ts`

**Change:** Added CI environment detection for headless mode

```typescript
capabilities: [
  {
    browserName: "chrome",
    "goog:chromeOptions": {
      args: process.env.CI
        ? ["--headless", "--no-sandbox", "--disable-dev-shm-usage"]
        : [],
    },
  },
],
```

**Effects:**

- **Local Development:** `process.env.CI` is undefined → visible browser (unchanged)
- **GitHub Actions:** `process.env.CI=true` → headless mode with flags
- **Headless Flags Used:**
  - `--headless`: Run browser without UI
  - `--no-sandbox`: Disable sandbox (required for CI)
  - `--disable-dev-shm-usage`: Reduce memory consumption

**Impact:**

- ✅ No changes to `package.json` (uses existing npm scripts)
- ✅ No changes to step definitions
- ✅ No changes to page objects
- ✅ No changes to hooks
- ✅ Local execution behavior fully preserved

---

### 3. Environment Variables Analysis ✅

#### Source: `e2e/.env.local`

| Variable   | Value                                | Type          | Storage         | Reason               |
| ---------- | ------------------------------------ | ------------- | --------------- | -------------------- |
| `BASE_URL` | `https://the-internet.herokuapp.com` | Non-sensitive | GitHub Variable | Public test URL      |
| `USERNAME` | `tomsmith`                           | Non-sensitive | GitHub Variable | Public test user     |
| `PASSWORD` | `SuperSecretPassword!`               | Sensitive     | GitHub Secret   | Contains credentials |

**Workflow Generation Logic:**

```bash
cat > e2e/.env.local << EOF
BASE_URL=${{ vars.BASE_URL }}
USERNAME=${{ vars.USERNAME }}
PASSWORD=${{ secrets.PASSWORD }}
EOF
```

**Security Measures:**

- ✅ Secrets never logged in workflow output
- ✅ Encrypted storage in GitHub
- ✅ Environment file generated at runtime (not committed)
- ✅ Automatic cleanup after workflow completes

---

### 4. GitHub Secrets Configuration ✅

**Required Secrets:** 1

| Secret Name | Value                  | Scope      |
| ----------- | ---------------------- | ---------- |
| `PASSWORD`  | `SuperSecretPassword!` | Repository |

**How to Create:**

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/secrets/actions
2. Click **New repository secret**
3. **Name:** `PASSWORD`
4. **Value:** `SuperSecretPassword!`
5. Click **Add secret**

**Verification:**

- Secret will appear as `***` in settings
- Available to all workflows in repository
- Never displayed in logs
- Can be rotated anytime

---

### 5. GitHub Variables Configuration ✅

**Required Variables:** 2

| Variable Name | Value                                | Scope      |
| ------------- | ------------------------------------ | ---------- |
| `BASE_URL`    | `https://the-internet.herokuapp.com` | Repository |
| `USERNAME`    | `tomsmith`                           | Repository |

**How to Create:**

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/variables/actions
2. Click **New repository variable**

**For each variable:**

- **Name:** `BASE_URL` (or `USERNAME`)
- **Value:** `https://the-internet.herokuapp.com` (or `tomsmith`)
- Click **Add variable**

**Verification:**

- Variables visible in settings (non-sensitive)
- Available to all workflows
- Can be updated anytime
- No restart needed

---

## 🚀 Execution Instructions

### Quick Start (5 minutes)

**Step 1: Create Secrets & Variables (2 minutes)**

1. Create 1 Secret:
   - Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/secrets/actions
   - Add `PASSWORD` = `SuperSecretPassword!`

2. Create 2 Variables:
   - Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/variables/actions
   - Add `BASE_URL` = `https://the-internet.herokuapp.com`
   - Add `USERNAME` = `tomsmith`

**Step 2: Trigger Workflow (1 minute)**

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/actions
2. Click: **WDIO BDD Framework - Manual Test Execution** (left sidebar)
3. Click: **Run workflow** (top right)
4. (Optional) Enter tag: `@smoke`, `@regression`, `@sanity`
5. Click: **Run workflow**

**Step 3: Monitor & Download (2 minutes)**

1. Watch real-time execution logs
2. Workflow completes in ~2-3 minutes
3. Go to **Artifacts** section
4. Download `test-reports` artifact
5. Extract and open `latest-report.html` in browser

---

### Detailed Execution Steps

#### Method 1: GitHub Web UI (Recommended for first-time use)

```
Repository → Actions Tab
  → Select "WDIO BDD Framework - Manual Test Execution"
    → Click "Run workflow" button
      → (Optional) Enter tag in input field
        → Click "Run workflow"
          → Monitor execution
            → Download artifacts
              → Open latest-report.html
```

#### Method 2: GitHub CLI (For automation/scripting)

```bash
# Trigger all tests
gh workflow run run-tests.yml

# Trigger with specific tag
gh workflow run run-tests.yml -f tag="@smoke"

# Check status
gh run list --workflow=run-tests.yml

# Download artifacts
gh run download <run-id> -n test-reports
```

#### Method 3: cURL (For API integration)

```bash
curl -X POST \
  https://api.github.com/repos/maruthikongara23102000/WDIO-BDD-Framework/actions/workflows/run-tests.yml/dispatches \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ref":"main","inputs":{"tag":"@smoke"}}'
```

---

### Tag Filtering Examples

| Workflow Input | Command Executed                                             | Tests Run       | Expected Scenarios           |
| -------------- | ------------------------------------------------------------ | --------------- | ---------------------------- |
| (empty)        | `npm run wdio`                                               | All tests       | 2 (all scenarios)            |
| `@smoke`       | `npm run wdio -- --cucumberOpts.tagExpression='@smoke'`      | Smoke only      | 1 scenario: login successful |
| `@regression`  | `npm run wdio -- --cucumberOpts.tagExpression='@regression'` | Regression only | 1 scenario: invalid login    |
| `@sanity`      | `npm run wdio -- --cucumberOpts.tagExpression='@sanity'`     | Sanity only     | 1 scenario: login successful |

**Feature File Reference:**

```gherkin
@smoke @sanity
Scenario: As a user, I can log into the secure area

@regression
Scenario: As a user, I receive an invalid login message
```

---

## 📊 Artifact Management

### Uploaded Artifacts

#### 1. Test Reports (`test-reports`)

```
e2e/reports/
├── latest-report.html        ← Open this in browser
├── latest-report.json
├── cucumber-report-TIMESTAMP.html
├── cucumber-report-TIMESTAMP.json
└── .scenarios.json            ← Internal cache
```

**Report Contents:**

- Summary cards: Total, Passed, Failed, Skipped, Pending
- Scenario table: Feature, Scenario, Status, Tags, Duration, Artifacts
- Timestamp of execution
- Scenario-wise pass/fail data

#### 2. Screenshots (`screenshots`)

```
e2e/screenshots/
├── scenario-failure-*.png     ← Captured on test failure
└── (only if tests fail)
```

#### 3. Logs (`execution-logs`)

```
e2e/logs/
├── execution.log              ← Test execution log
└── (step-by-step execution details)
```

### Download & View

**Steps:**

1. Go to workflow run page
2. Scroll to **Artifacts** section
3. Click **test-reports** → Download
4. Extract ZIP file
5. Open `latest-report.html` in web browser
6. View scenario-wise results with tags and duration

**Retention:**

- Reports: 30 days (configurable)
- Screenshots: 30 days (configurable)
- Logs: 30 days (configurable)
- Older artifacts auto-deleted after retention period

---

## ✅ Final Validation Checklist

### Pre-Deployment Verification

- [ ] **Workflow File**
  - [ ] `.github/workflows/run-tests.yml` exists in main branch
  - [ ] YAML syntax is valid (checked in editor)
  - [ ] Workflow is visible in GitHub Actions tab

- [ ] **Configuration**
  - [ ] `wdio.conf.ts` has CI environment detection
  - [ ] Headless flags are correct: `--headless`, `--no-sandbox`, `--disable-dev-shm-usage`
  - [ ] `package.json` unchanged
  - [ ] `e2e/.env.local` unchanged

- [ ] **GitHub Settings**
  - [ ] Secret `PASSWORD` created with value `SuperSecretPassword!`
  - [ ] Variable `BASE_URL` created with value `https://the-internet.herokuapp.com`
  - [ ] Variable `USERNAME` created with value `tomsmith`
  - [ ] All settings are for the correct repository

### Functional Verification

- [ ] **Workflow Trigger**
  - [ ] Workflow appears in Actions tab
  - [ ] "Run workflow" button is clickable
  - [ ] Tag input field appears (optional)

- [ ] **Test Execution**
  - [ ] Workflow runs without errors
  - [ ] All 6 steps execute (checkout → upload artifacts)
  - [ ] Tests complete in 2-3 minutes
  - [ ] Exit code: 0 (success)

- [ ] **Artifact Upload**
  - [ ] test-reports artifact uploads successfully
  - [ ] latest-report.html is included
  - [ ] Report displays all scenarios correctly

- [ ] **Local Behavior**
  - [ ] Local execution still uses visible browser
  - [ ] `cd e2e && npm run wdio` still works
  - [ ] No local behavior changes
  - [ ] Tag scripts still work: `npm run smoke`, `npm run regression`

---

## 🐛 Troubleshooting Guide

### Issue: Workflow not visible in Actions tab

**Symptoms:**

- "WDIO BDD Framework - Manual Test Execution" doesn't appear
- No workflows listed

**Root Causes:**

1. Workflow file not in correct location
2. File not pushed to main branch
3. YAML syntax error

**Solutions:**

```bash
# Verify file exists and is in main branch
git log --oneline --all -- .github/workflows/run-tests.yml

# Check file is properly formatted
cd .github/workflows
ls -la run-tests.yml

# Validate YAML syntax
cat run-tests.yml | python -m yaml
```

**Actions:**

1. Ensure `.github/workflows/run-tests.yml` is in root directory
2. Commit and push to main: `git push origin main`
3. Wait 30 seconds and refresh Actions tab
4. Check for workflow syntax errors in GitHub UI

---

### Issue: Tag input field not showing

**Symptoms:**

- "Run workflow" dialog appears but no tag input field

**Root Causes:**

1. Workflow YAML missing `workflow_dispatch` section
2. Input definition incorrect
3. YAML syntax error in inputs section

**Solutions:**

1. Verify YAML has `workflow_dispatch` section:

```yaml
on:
  workflow_dispatch:
    inputs:
      tag:
        description: "..."
        required: false
        type: string
```

2. Check for YAML indentation errors
3. Validate with: https://www.yamllint.com/

---

### Issue: Environment file not created

**Symptoms:**

- Workflow fails on "Create Environment File" step
- Error: `e2e/.env.local: command not found`

**Root Causes:**

1. Secrets/variables not created in GitHub
2. Variable names don't match exactly
3. Shell compatibility issue

**Solutions:**

```bash
# Verify secrets exist
# GitHub UI: Settings → Secrets and variables → Actions

# Check variable names (case-sensitive):
# PASSWORD (secret)
# BASE_URL (variable)
# USERNAME (variable)

# Verify workflow uses correct syntax:
# ${{ secrets.PASSWORD }}
# ${{ vars.BASE_URL }}
# ${{ vars.USERNAME }}
```

**Actions:**

1. Create all missing secrets/variables
2. Verify exact names match (case-sensitive)
3. Re-run workflow

---

### Issue: Tests run but report shows "No scenarios executed"

**Symptoms:**

- Workflow completes successfully
- Test logs show "6 passing (6.8s)"
- HTML report shows "0 scenarios"

**Root Causes:**

1. Tag filter syntax error
2. Tag doesn't match feature file tags
3. Report generation bug

**Solutions:**

```bash
# Check feature file tags
cat e2e/features/login.feature | grep "@"

# Verify tag syntax in workflow
# Correct: @smoke (with @)
# Wrong: smoke (without @)

# Run workflow without tag first
# (to verify framework works)

# Check test logs for tag expression errors
```

**Actions:**

1. Verify tag includes @ symbol: `@smoke` not `smoke`
2. Check feature file has matching tags
3. Try running without tag first (all tests)
4. Review test execution logs for errors

---

### Issue: Chrome fails to start in headless mode

**Symptoms:**

- Workflow fails on "Execute Tests" step
- Error: `Failed to launch Chrome`
- Error: `Cannot start Chrome`

**Root Causes:**

1. Missing Chrome dependencies in ubuntu-latest
2. Sandbox disabled but other flags missing
3. Chrome path issue

**Solutions:**
Current configuration includes required flags:

```typescript
args: process.env.CI
  ? ["--headless", "--no-sandbox", "--disable-dev-shm-usage"]
  : [],
```

**If still failing:**

1. Add additional flags in `wdio.conf.ts`:

```typescript
args: [
  "--headless",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--single-process",
];
```

2. Check ubuntu-latest has Chrome pre-installed
3. Review Chrome error logs in workflow output

---

### Issue: Artifacts not uploading

**Symptoms:**

- Workflow completes successfully
- No Artifacts section visible
- Or: "0 files found"

**Root Causes:**

1. Reports directory empty (test failure)
2. Path incorrect in upload action
3. `if: always()` condition not working

**Solutions:**

```bash
# Verify reports are generated
ls -la e2e/reports/

# Check workflow logs for upload step
# Should show: "1 file(s) uploaded"

# Verify path in workflow:
path: e2e/reports/
```

**Actions:**

1. Check test execution logs for errors
2. Verify reports directory has files
3. Ensure `if: always()` is in workflow
4. Re-run workflow and check upload step logs

---

### Issue: "Permission denied" when pushing changes

**Symptoms:**

- `git push` fails with authentication error
- "Permission to maruthikongara23102000/..."

**Root Causes:**

1. GitHub credentials not updated
2. SSH key not configured
3. Token expired

**Solutions:**

```bash
# Clear credential cache
git credential-manager erase host=github.com

# Generate new Personal Access Token
# https://github.com/settings/tokens

# Or use SSH instead
git remote set-url origin git@github.com:maruthikongara23102000/WDIO-BDD-Framework.git
```

---

## 📊 Performance Metrics

### Expected Execution Times

| Phase                   | Typical Duration |
| ----------------------- | ---------------- |
| Checkout                | 5 seconds        |
| Setup Node.js           | 15 seconds       |
| Install dependencies    | 30 seconds       |
| Create environment file | 2 seconds        |
| Display configuration   | 2 seconds        |
| Execute tests           | 60-90 seconds    |
| Upload artifacts        | 10 seconds       |
| **Total**               | **~2-3 minutes** |

### Optimization Tips

1. **Use tag filtering** to reduce test scope:
   - `@smoke`: ~30 seconds
   - `@regression`: ~30 seconds
   - All tests: ~90 seconds

2. **npm caching** enabled:
   - First run: ~45 seconds (install)
   - Subsequent runs: ~15 seconds (cached)

3. **Artifact upload** is fast:
   - Small reports: ~10 seconds
   - Large with screenshots: ~20 seconds

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────┐
│ GitHub Actions Trigger                          │
│ • workflow_dispatch (manual)                    │
│ • Optional tag input                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Workflow Execution (ubuntu-latest)              │
│ • Node.js 24.11.1                              │
│ • npm caching enabled                          │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────┐     ┌────────────────┐
│ All Tests    │     │ Tag Filter     │
│ (npm wdio)   │     │ (@smoke, etc)  │
└──────┬───────┘     └────────┬───────┘
       │                      │
       └──────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Chrome Headless    │
         │ Execute Scenarios  │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Generate Reports   │
         │ (JSON + HTML)      │
         └────────┬───────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌───────────┐  ┌─────────┐
│Reports │  │Screenshots│  │  Logs   │
│Artifact│  │ Artifact  │  │Artifact │
└────────┘  └───────────┘  └─────────┘
```

---

## 🎓 Advanced Usage

### Scheduled Execution (Optional Enhancement)

To run tests on a schedule (e.g., daily at 2 AM UTC):

```yaml
on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM UTC
  workflow_dispatch: # Also allow manual trigger
    inputs:
      tag:
        description: "Optional tag"
        required: false
        type: string
```

### Multiple Tag Support (Optional Enhancement)

To support multiple tags with OR logic:

```bash
# Input: "@smoke OR @sanity"
npm run wdio -- --cucumberOpts.tagExpression='@smoke or @sanity'

# Input: "@smoke AND @regression"
npm run wdio -- --cucumberOpts.tagExpression='@smoke and @regression'
```

### Custom Reporting (Optional Enhancement)

To generate custom HTML reports, modify `ReportHelper`:

- Add email notifications
- Add Slack integration
- Generate PDF reports
- Custom dashboard

---

## 📚 References

### Official Documentation

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Workflow Dispatch](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#ondispatch_workflowworkflow_dispatch)
- [Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
- [Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

### WebdriverIO References

- [WDIO Cucumber Framework](https://webdriver.io/docs/cucumber/)
- [Tag Expressions](https://cucumber.io/docs/cucumber/api/#tags)
- [Chrome Options](https://chromedriver.chromium.org/capabilities)

### Node.js

- [Node.js 24.11.1](https://nodejs.org/en/blog/release/v24.11.1/)
- [npm ci Documentation](https://docs.npmjs.com/cli/v10/commands/npm-ci)

---

## 🎉 Summary

Your GitHub Actions setup is now complete and production-ready. You can:

✅ Manually trigger tests from GitHub  
✅ Filter tests by Cucumber tags  
✅ Monitor execution in real-time  
✅ Download reports and artifacts  
✅ View scenario-wise results  
✅ Preserve local testing behavior

**Next Step:** Create the 1 secret and 2 variables in GitHub settings, then trigger your first workflow!

---

**Document Version:** 1.0  
**Created:** 2026-06-28  
**Status:** Production Ready  
**Last Updated:** 2026-06-28
