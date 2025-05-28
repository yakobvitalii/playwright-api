import type { APIRequestContext } from '@playwright/test';

export async function getToken(
  requestContext: APIRequestContext,
  email: string,
  password: string
): Promise<string | null> {
  const loginRes = await requestContext.post('/api/login', { data: { email, password } });
  if (loginRes.ok()) {
    const body = await loginRes.json();
    return body.token;
  }
  return null;
}