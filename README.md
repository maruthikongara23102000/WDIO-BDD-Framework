# WDIO BDD Framework

## Installation

```bash
npm install
```

## Folder Structure

- e2e/config - environment configuration
- e2e/constants - shared constants
- e2e/features - Cucumber feature files
- e2e/hooks - reusable hooks
- e2e/pageobjects - page object classes
- e2e/step-definitions - step definitions
- e2e/helpers - helpers
- e2e/utils - environment, file, and screenshot utilities
- e2e/test-data - test data
- e2e/reports - generated HTML and JSON reports
- e2e/screenshots - failure screenshots
- e2e/logs - execution logs
- e2e/.env.local - local environment values

## Environment Configuration

Create or update e2e/.env.local with:

```env
BASE_URL=https://the-internet.herokuapp.com
USERNAME=tomsmith
PASSWORD=SuperSecretPassword!
```

## Running Tests

```bash
npm run wdio
```

## Running Smoke Tests

```bash
npm run smoke
```

## Running Regression Tests

```bash
npm run regression
```

## Running Sanity Tests

```bash
npm run sanity
```

## Report Location

Reports are generated under e2e/reports after each execution.
