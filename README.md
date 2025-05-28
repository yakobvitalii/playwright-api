API Testing Framework with Playwright and TypeScript
Project Overview
This framework provides a scalable, maintainable, and efficient setup for automated API testing using Playwright with TypeScript. It enables engineers to write clean, reliable tests for REST APIs with features such as:

Structured test suites by users and scenarios
Data-driven tests with external JSON data
Schema validation using Zod
Custom reusable assertions with detailed logging
Retry logic for network resiliency
Response time measurements and performance checks
CI/CD integration with Azure DevOps

Quick Start Guide
Prerequisites:

Node.js (>=16)

1. Clone the repository:
https://yakobvitaly66@dev.azure.com/yakobvitaly66/API/_git/API
2. Install dependencies:
npm install

Run Test:
npx playwright test
To run tests for a specific file:
npx playwright test tests/complicatedApi.spec.ts

Framework Architecture
tests/ — contains test files grouped by feature or user scenarios.

apiHelper/

clients/ 

constants/

data/ — external JSON files with test data (e.g., users).

schemas/ — Zod schemas for response validation.

utils/ — utility functions including:

auth.ts — authentication helpers like getToken.

retry.ts — retry mechanism for flaky requests.

log.ts — centralized logging utility.

assertions.ts — reusable custom assertion functions.

models/ — TypeScript interfaces and types for API response payloads.

playwright.config.ts — Playwright configuration, including test environment settings.

Key Features
Token management: Centralized login and token fetching per user.
Data-driven tests: User credentials loaded from JSON to run parallel user scenarios.
Assertions: Typed, reusable assertions with enhanced logging (log.info, log.error).
Retries: Automatic retry on network errors or server errors.
Rate limiting: Graceful handling of 429 responses.
Performance checks: Response time measurement and validation.

Generate HTML Report
npx playwright show-report

CI/CD Pipeline Overview
Pipeline built on Azure DevOps (config file: .azure-pipelines.yml).

Runs on Node.js agents with:
npm install
npx playwright install
npx playwright test --reporter=dot,json,html

Troubleshooting Common Issues
1. JSON Import Errors
Make sure tsconfig.json includes:
json

{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "commonjs"
  }
}

2. Playwright Context Errors
Use the request fixture correctly:

const authRequest = await request.newContext({
  extraHTTPHeaders: { Authorization: `Bearer ${token}` }
});

3. Failing Tests Due to Schema Validation
Check if response matches expected schema. Use detailed logs in assertions.ts for debugging.

4. Slow or Flaky Tests
Use the retry utility in retry.ts to automatically retry flaky requests.

Example: Test with Custom Assertions and Logging

import { expectUserCreationResponse } from '../apiHelper/utils/assertions';

test('Create user and validate', async ({ request }) => {
  const res = await request.post('/api/users', { data: { name: 'Alice', job: 'QA Engineer' } });
  const body = await res.json();
  expectUserCreationResponse(body, res.status());
});

Example: Retry Request on Failures

import { withRetry } from '../apiHelper/utils/retry';

const res = await withRetry(() => request.get('/api/users?page=1'));
expect(res.status()).toBeLessThan(500);