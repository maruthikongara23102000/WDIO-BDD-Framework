# GitHub Actions Setup Guide - WDIO BDD Framework

## Overview

This guide provides step-by-step instructions to set up GitHub Actions for your WDIO-BDD-Framework, enabling manual test execution directly from GitHub with customizable Cucumber tags.

---

## 1. GitHub Secrets Configuration

**Purpose:** Store sensitive data securely (not visible in logs)

### Required Secrets

Create the following GitHub Secret in your repository:

**Secret Name:** `PASSWORD`  
**Secret Value:** `SuperSecretPassword!`

### Steps to Create Secret:

1. Go to your GitHub repository: https://github.com/maruthikongara23102000/WDIO-BDD-Framework
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter Name: `PASSWORD`
5. Enter Value: `SuperSecretPassword!`
6. Click **Add secret**

---

## 2. GitHub Variables Configuration

**Purpose:** Store non-sensitive configuration values

### Required Variables

Create the following GitHub Variables in your repository:

| Variable Name | Variable Value                       |
| ------------- | ------------------------------------ |
| `BASE_URL`    | `https://the-internet.herokuapp.com` |
| `USERNAME`    | `tomsmith`                           |

### Steps to Create Variables:

1. Go to your GitHub repository: https://github.com/maruthikongara23102000/WDIO-BDD-Framework
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click the **Variables** tab
4. Click **New repository variable**
5. For each variable above:
   - Enter Name (e.g., `BASE_URL`)
   - Enter Value (e.g., `https://the-internet.herokuapp.com`)
   - Click **Add variable**

---

## 3. File Changes Summary

### Modified Files

#### `wdio.conf.ts`

**Change:** Added headless mode support for CI environments

```typescript
capabilities: [
  {
    browserName: "chrome",
    "goog:chromeOptions": {
      args: process.env.CI ? ["--headless", "--no-sandbox", "--disable-dev-shm-usage"] : [],
    },
  },
],
```

**Effect:**

- ✅ Local execution: Visible Chrome browser (existing behavior preserved)
- ✅ GitHub Actions: Headless Chrome (optimized for CI)
- ✅ No changes required to package.json or step definitions

### New Files

#### `.github/workflows/run-tests.yml`

Complete GitHub Actions workflow for manual test execution with:

- Node.js 24.11.1 setup
- npm dependency caching
- Environment file generation from secrets/variables
- Tag-based test filtering
- Artifact uploads (reports, screenshots, logs)

---

## 4. Execution Instructions

### Step 1: Ensure All Configuration is Complete

Verify that:

- ✅ Secret `PASSWORD` is created in GitHub
- ✅ Variables `BASE_URL` and `USERNAME` are created in GitHub
- ✅ Workflow file is pushed to the `main` branch
- ✅ `wdio.conf.ts` is updated with headless support

### Step 2: Trigger the Workflow from GitHub

**Method 1: Using GitHub Web UI**

1. Go to your repository: https://github.com/maruthikongara23102000/WDIO-BDD-Framework
2. Click on **Actions** tab
3. On the left sidebar, click **WDIO BDD Framework - Manual Test Execution**
4. Click **Run workflow** (dropdown on the right)
5. (Optional) Enter a tag in the `tag` input field:
   - `@smoke` - Run only smoke tests
   - `@regression` - Run regression tests
   - `@sanity` - Run sanity tests
   - Leave empty - Run all tests
6. Click **Run workflow**
7. Monitor the workflow execution (usually completes in 2-3 minutes)

**Method 2: Using Git CLI (from local terminal)**

```bash
# Optional: Specify a tag
gh workflow run run-tests.yml -f tag="@smoke"

# Or run without tag (all tests)
gh workflow run run-tests.yml
```

### Step 3: Monitor and Download Results

1. **During Execution:**
   - Click on the running workflow to see real-time logs
   - Watch the step-by-step progress

2. **After Completion:**
   - Scroll down to the **Artifacts** section
   - Download the following artifacts:
     - `test-reports` - Contains HTML and JSON reports
     - `screenshots` - Browser screenshots of failures (if any)
     - `execution-logs` - Test execution logs

3. **View HTML Report Locally:**
   - Extract `test-reports` artifact
   - Open `latest-report.html` in your web browser
   - View scenario-wise pass/fail data with tags and duration

---

## 5. Workflow Behavior

### Tag Filtering Examples

| Workflow Input | Execution                                                    | Tests Run                  |
| -------------- | ------------------------------------------------------------ | -------------------------- |
| (empty)        | `npm run wdio`                                               | All 2 scenarios            |
| `@smoke`       | `npm run wdio -- --cucumberOpts.tagExpression='@smoke'`      | Only @smoke scenarios      |
| `@regression`  | `npm run wdio -- --cucumberOpts.tagExpression='@regression'` | Only @regression scenarios |
| `@sanity`      | `npm run wdio -- --cucumberOpts.tagExpression='@sanity'`     | Only @sanity scenarios     |

### Artifact Retention

- **Test Reports:** 30 days
- **Screenshots:** 30 days
- **Logs:** 30 days

(Configurable in workflow file via `retention-days` parameter)

---

## 6. Environment Variables Reference

| Variable   | Storage         | Usage                 | Example Value                        |
| ---------- | --------------- | --------------------- | ------------------------------------ |
| `BASE_URL` | GitHub Variable | Test target URL       | `https://the-internet.herokuapp.com` |
| `USERNAME` | GitHub Variable | Login credentials     | `tomsmith`                           |
| `PASSWORD` | GitHub Secret   | Login credentials     | `SuperSecretPassword!`               |
| `CI`       | Workflow env    | Headless mode trigger | `true`                               |

---

## 7. Troubleshooting Guide

### Issue: "Workflow not visible in Actions tab"

**Cause:** Workflow file not recognized

**Solution:**

1. Verify `.github/workflows/run-tests.yml` exists in the `main` branch
2. Check file syntax is valid YAML
3. Go to **Actions** → **All workflows** and manually enable if needed

### Issue: "Input field for tag is not showing"

**Cause:** Workflow syntax error

**Solution:**

1. Check `.github/workflows/run-tests.yml` has correct `workflow_dispatch` section
2. Validate YAML syntax using online YAML validator
3. Re-push the workflow file

### Issue: "Tests fail with: Cannot find module"

**Cause:** Dependencies not installed or Node.js version mismatch

**Solution:**

1. Verify Node.js version in workflow is `24.11.1`
2. Check `npm ci` succeeds in logs
3. Verify `package.json` has all required dependencies

### Issue: "Environment file not created"

**Cause:** Secrets/Variables not configured

**Solution:**

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Verify `PASSWORD` secret exists
3. Verify `BASE_URL` and `USERNAME` variables exist
4. Check spelling matches exactly (case-sensitive)
5. Re-run workflow after creating missing secrets/variables

### Issue: ".env.local file has wrong values"

**Cause:** GitHub Secret/Variable names mismatch

**Solution:**

1. In workflow logs, check the "Create Environment File" step
2. Verify the variable names in `.github/workflows/run-tests.yml` match your GitHub configuration
3. Re-create secrets/variables with exact names if needed

### Issue: "Tests run but report shows 'No scenarios executed'"

**Cause:** Tag expression syntax error

**Solution:**

1. Verify tag input format (e.g., `@smoke` not `smoke`)
2. Check feature file has matching tags (e.g., `@smoke` in login.feature)
3. Review test logs for tag expression errors
4. Run without tag filter first to verify tests work

### Issue: "Chrome fails to start in headless mode"

**Cause:** Missing Chrome sandbox flags

**Solution:**
Already configured in updated `wdio.conf.ts` with:

- `--headless`
- `--no-sandbox`
- `--disable-dev-shm-usage`

If still failing:

1. Check workflow logs for Chrome errors
2. Verify runner OS is ubuntu-latest
3. Consider adding `--disable-gpu` flag

### Issue: "Artifacts not uploading"

**Cause:** Test failure stops workflow before upload

**Solution:**
✅ Workflow uses `if: always()` - artifacts upload even on failure

1. Check artifact section in workflow logs
2. If reports folder is empty, check test logs for errors
3. Verify e2e/reports/ path is correct

### Issue: "Workflow times out"

**Cause:** Tests taking longer than timeout

**Solution:**

1. Current timeout: 30 minutes
2. Reduce test scope by using tag filter
3. Increase timeout in workflow if needed:
   ```yaml
   timeout-minutes: 45
   ```

---

## 8. Validation Checklist

Before finalizing setup, verify:

### Pre-Deployment

- ✅ Workflow file exists at `.github/workflows/run-tests.yml`
- ✅ `wdio.conf.ts` has headless mode support
- ✅ `package.json` unchanged
- ✅ `e2e/.env.local` unchanged (created at runtime)
- ✅ Git repository is public or actions are enabled

### GitHub Configuration

- ✅ Secret `PASSWORD` created with value `SuperSecretPassword!`
- ✅ Variable `BASE_URL` created with value `https://the-internet.herokuapp.com`
- ✅ Variable `USERNAME` created with value `tomsmith`
- ✅ All files pushed to `main` branch

### Workflow Functionality

- ✅ Actions tab shows "WDIO BDD Framework - Manual Test Execution"
- ✅ "Run workflow" button appears
- ✅ Tag input field is available (optional)
- ✅ Workflow runs without errors
- ✅ Reports artifact uploads successfully
- ✅ Latest report can be downloaded and opened locally

### Test Execution

- ✅ All tests pass in GitHub Actions
- ✅ All tests still pass locally (no changes to behavior)
- ✅ Tag filtering works (@smoke, @regression, @sanity)
- ✅ HTML report displays scenarios correctly
- ✅ Screenshots upload on failure

---

## 9. Quick Start Command Reference

```bash
# Trigger workflow with specific tag
gh workflow run run-tests.yml -f tag="@smoke"

# Trigger workflow to run all tests
gh workflow run run-tests.yml

# Check workflow status
gh run list --workflow=run-tests.yml

# Download artifacts (after workflow completes)
gh run download <run-id> -n test-reports
```

---

## 10. Additional Notes

### Local Testing Remains Unchanged

Your local execution continues to work exactly as before:

```bash
cd e2e
npm run wdio          # All tests
npm run smoke         # @smoke tag
npm run regression    # @regression tag
npm run sanity        # @sanity tag
```

### CI Environment Detection

The workflow sets `CI=true`, which triggers:

- Headless Chrome mode in `wdio.conf.ts`
- Read-only GitHub variables/secrets
- Artifact upload capability

### Security Best Practices

- ✅ `PASSWORD` stored as GitHub Secret (encrypted)
- ✅ Non-sensitive variables in GitHub Variables
- ✅ Secrets never logged in workflow output
- ✅ Environment file generated at runtime (not committed)

---

## Need Help?

1. Check the **Troubleshooting Guide** section above
2. Review workflow logs in GitHub Actions
3. Verify all secrets/variables are created
4. Ensure workflow file syntax is correct
5. Test locally first: `cd e2e && npm run wdio`

---

**Setup Complete!** 🎉  
Your WDIO-BDD-Framework is now ready for CI/CD with GitHub Actions.
