# GitHub Actions Setup - Quick Reference

## ✅ Completed Setup

All files have been created, modified, and pushed to your GitHub repository.

---

## 📋 Deliverables Checklist

### 1. ✅ Workflow YAML File

- **Location:** `.github/workflows/run-tests.yml`
- **Status:** Created and pushed to main branch
- **Features:**
  - Manual workflow trigger (`workflow_dispatch`)
  - Optional Cucumber tag input
  - Node.js 24.11.1 setup
  - Dependency caching (npm)
  - Environment file generation
  - Tag-based test execution
  - Artifact uploads (reports, screenshots, logs)
  - Test summary in GitHub UI

### 2. ✅ Configuration Changes

- **Modified File:** `wdio.conf.ts`
- **Changes:**
  - Added headless mode detection via `CI` environment variable
  - Chrome headless flags: `--headless`, `--no-sandbox`, `--disable-dev-shm-usage`
  - Local execution behavior preserved (visible browser)
  - CI execution optimized for GitHub Actions

### 3. ✅ Documentation

- **Location:** `GITHUB_ACTIONS_SETUP.md`
- **Contents:**
  - GitHub Secrets configuration
  - GitHub Variables configuration
  - Step-by-step setup instructions
  - Workflow execution guide
  - Troubleshooting guide
  - Validation checklist

---

## 🔐 GitHub Secrets to Create

| Secret Name | Value                  |
| ----------- | ---------------------- |
| `PASSWORD`  | `SuperSecretPassword!` |

**How to create:**

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/secrets/actions
2. Click "New repository secret"
3. Name: `PASSWORD`
4. Value: `SuperSecretPassword!`
5. Click "Add secret"

---

## 🔧 GitHub Variables to Create

| Variable Name | Value                                |
| ------------- | ------------------------------------ |
| `BASE_URL`    | `https://the-internet.herokuapp.com` |
| `USERNAME`    | `tomsmith`                           |

**How to create:**

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/variables/actions
2. Click "New repository variable"
3. For each variable:
   - Name: (e.g., `BASE_URL`)
   - Value: (e.g., `https://the-internet.herokuapp.com`)
   - Click "Add variable"

---

## 🚀 Running Tests from GitHub

### Method 1: Web UI (Easiest)

1. Go to: https://github.com/maruthikongara23102000/WDIO-BDD-Framework/actions
2. Select: **"WDIO BDD Framework - Manual Test Execution"**
3. Click: **"Run workflow"** (top right)
4. (Optional) Enter tag: `@smoke`, `@regression`, `@sanity`, or leave empty
5. Click: **"Run workflow"**
6. Monitor execution in real-time
7. Download artifacts when complete

### Method 2: GitHub CLI

```bash
# Run all tests
gh workflow run run-tests.yml

# Run specific tag
gh workflow run run-tests.yml -f tag="@smoke"
```

---

## 📊 Downloading Reports

1. **After workflow completes:**
   - Go to the workflow run page
   - Scroll to "Artifacts" section
   - Download `test-reports` artifact

2. **View HTML Report:**
   - Extract downloaded artifact
   - Open `latest-report.html` in browser
   - View scenario-wise pass/fail with tags and duration

3. **Artifact Retention:**
   - Reports: 30 days
   - Screenshots: 30 days
   - Logs: 30 days

---

## 🧪 Tag Filtering Examples

| Input         | Tests Run                               |
| ------------- | --------------------------------------- |
| (empty)       | All tests (2 scenarios)                 |
| `@smoke`      | Only @smoke scenarios (1 scenario)      |
| `@regression` | Only @regression scenarios (1 scenario) |
| `@sanity`     | Only @sanity scenarios (1 scenario)     |

---

## ✨ Key Features

- ✅ Node.js 24.11.1 (matches your local setup)
- ✅ Dependency caching (faster runs)
- ✅ Headless Chrome (CI optimized)
- ✅ Environment variables from secrets/variables
- ✅ Tag filtering (smoke, regression, sanity)
- ✅ Artifact uploads (reports, screenshots, logs)
- ✅ Job summary in GitHub UI
- ✅ Local behavior unchanged

---

## 🔍 Validation Steps

Before first run, verify:

- [ ] Secret `PASSWORD` is created in GitHub
- [ ] Variable `BASE_URL` is created in GitHub
- [ ] Variable `USERNAME` is created in GitHub
- [ ] Workflow file is visible in Actions tab
- [ ] `wdio.conf.ts` has CI environment detection
- [ ] All changes are pushed to main branch

---

## 🐛 Troubleshooting

### Workflow not showing in Actions tab?

- Wait 30 seconds and refresh
- Verify `.github/workflows/run-tests.yml` is in main branch

### Tag input not showing?

- Check YAML syntax in workflow file
- Verify `workflow_dispatch` section exists

### Environment file error?

- Verify secrets/variables are created with exact names
- Check capitalization: `PASSWORD`, `BASE_URL`, `USERNAME`

### Tests fail in CI but pass locally?

- Verify CI environment detection works
- Check Chrome flags in `wdio.conf.ts`
- Review test logs in GitHub Actions

### Reports empty?

- Check test execution logs for errors
- Verify e2e/reports/ directory is created
- Confirm report generation doesn't have errors

See `GITHUB_ACTIONS_SETUP.md` for detailed troubleshooting.

---

## 📁 Files Created/Modified

```
.github/workflows/run-tests.yml       [NEW]
GITHUB_ACTIONS_SETUP.md               [NEW]
wdio.conf.ts                          [MODIFIED]
```

---

## 🎯 Next Steps

1. **Create Secrets & Variables** (5 minutes)
   - Go to repository settings
   - Add 1 secret + 2 variables

2. **Verify Setup** (2 minutes)
   - Go to Actions tab
   - Verify workflow is visible

3. **Run First Test** (3 minutes)
   - Click "Run workflow"
   - Choose tag (optional)
   - Download report when complete

---

## 📞 Quick Links

- **Repository:** https://github.com/maruthikongara23102000/WDIO-BDD-Framework
- **Actions Tab:** https://github.com/maruthikongara23102000/WDIO-BDD-Framework/actions
- **Secrets:** https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/secrets/actions
- **Variables:** https://github.com/maruthikongara23102000/WDIO-BDD-Framework/settings/variables/actions
- **Workflow File:** https://github.com/maruthikongara23102000/WDIO-BDD-Framework/blob/main/.github/workflows/run-tests.yml

---

**Status:** ✅ Ready for Production

All files are in place. Create the secrets/variables and you're ready to go!
