import { test, request } from '@playwright/test';
import users from '../apiHelper/data/loginUser.json';
import { withRetry, getToken } from '../apiHelper/utils/index';
import {
  expectUserCreationResponse,
  expectPaginationResponse,
  expectStatusOk,
  expectJsonContentType,
  expectNoSensitiveData,
  expectStatusLessThan500,
  expectRateLimitStatus,
  expectResponseTime
} from '../apiHelper/utils/customAssertions';
import { APIEndpoints, TestData } from '../apiHelper/constants';

test.describe('API', () => {
    for (const user of users) {
        test.describe(`Tests for user: ${user.email}`, () => {
            let token: string | null = null;

            test.beforeAll(async ({ request }) => {
                token = await getToken(request, user.email, user.password);
            });

           test('Create user with dynamic data and validate response schema', async ({ request }) => {
                const user = TestData.User.ALICE;
                const res = await request.post(APIEndpoints.USERS, {
                    data: {
                        name: user.name,
                        job: user.job,
                    },
                });
                const body = await res.json();
                expectUserCreationResponse(body, res.status());
            });

            test('Handle dynamic pagination', async ({ request }) => {
                let page = 1;
                let hasMore = true;

                while (hasMore) {
                    const res = await request.get(APIEndpoints.getUsersPage(1));
                    const body = await res.json();
                    expectPaginationResponse(body);
                    hasMore = page < body.total_pages;
                    page++;
                }
            });

            test('Access secured endpoint with valid token', async () => {
                test.skip(!token, `Skipping test because login failed for user: ${user.email}`);
                const authContext = await request.newContext({
                    baseURL: process.env.BASE_URL,
                    extraHTTPHeaders: { Authorization: `Bearer ${token}` }
                });
                const res = await authContext.get(APIEndpoints.getUsersPage(1));
                expectStatusOk(res.status());
            });

            test('Validate response headers', async ({ request }) => {
                const res = await request.get(APIEndpoints.getUsersPage(1));
                expectStatusOk(res.status());
                expectJsonContentType(res.headers());
            });

            test('Sensitive data should not be leaked', async ({ request }) => {
                const res = await request.post(APIEndpoints.LOGIN, {
                    data: { email: user.email, password: user.password }
                });
                const body = await res.json();
                expectNoSensitiveData(body);
            });

            test('Retry request on network error or 5xx', async ({ request }) => {
                const res = await withRetry(() => request.get(APIEndpoints.getUsersPage(1)));
                expectStatusLessThan500(res.status());
            });

            test('Handle API rate limiting gracefully', async ({ request }) => {
                const res = await request.get(APIEndpoints.getUsersPage(1));

                if (res.status() === 429) {
                    const retryAfter = parseInt(res.headers()['retry-after'] || '1', 10);
                    await new Promise(r => setTimeout(r, retryAfter * 1000));
                }

                expectRateLimitStatus(res.status());
            });

            test('Measure and assert response time', async ({ request }) => {
                const start = Date.now();
                const res = await request.get(APIEndpoints.getUsersPage(1));
                const duration = Date.now() - start;

                expectStatusOk(res.status());
                expectResponseTime(duration);
            });
        });
    }
});