import { expect } from "playwright/test";
import { LoginResponse, PaginatedUsersResponse, User, UserCreationResponse } from "../models/user";
import { userSchema } from "../schemas/schemas";
import { logInfo, logError } from './logger';

export function expectValidUser(user: User) {
    logInfo("Validating user object structure...");
    try {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("createdAt");
    } catch (error) {
        logError(`User object structure invalid: ${JSON.stringify(user)}`);
        throw error;
    }
};

export function expectHttpStatus(message: string, expectedStatus: number) {
    logInfo(`Expecting HTTP status message to include: ${expectedStatus}`);
    try {
        expect(message).toContain(expectedStatus.toString());
    } catch (error) {
        logError(`Unexpected HTTP message: ${message}`);
        throw error;
    }
};

export function expectUserCreationResponse(body: UserCreationResponse, status: number) {
    logInfo("Validating user creation response...");
    if (status !== 201) {
        logError(`Expected status 201, but got ${status}`);
    }
    expect(status).toBe(201);

    const parseResult = userSchema.safeParse(body);
    logInfo(`Schema validation result: ${parseResult.success ? "PASSED" : "FAILED"}`);
    if (!parseResult.success) {
        logError(`Schema validation failed: ${JSON.stringify(parseResult.error, null, 2)}`);
    }
    expect(parseResult.success).toBeTruthy();

    expect(body.id).toBeDefined();
    expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
};

export function expectPaginationResponse(body: PaginatedUsersResponse) {
    logInfo("Validating pagination response data structure...");
    if (!Array.isArray(body.data)) {
        logError("Expected 'data' to be an array.");
    }
    expect(Array.isArray(body.data)).toBeTruthy();
};

export function expectStatusOk(status: number) {
    logInfo(`Expecting HTTP status 200. Received: ${status}`);
    if (status !== 200) {
        logError(`Unexpected status: ${status}`);
    }
    expect(status).toBe(200);
};

export function expectJsonContentType(headers: Record<string, string>) {
    logInfo("Validating that Content-Type is application/json...");
    const contentType = headers["content-type"];
    if (!contentType?.includes("application/json")) {
        logError(`Unexpected content-type: ${contentType}`);
    }
    expect(contentType).toContain("application/json");
};

export function expectNoSensitiveData(body: LoginResponse) {
    logInfo("Ensuring no sensitive data like password is present in response...");
    if ("password" in body) {
        logError("Sensitive field 'password' is present in response!");
    }
    expect(body.password).toBeUndefined();
};

export function expectStatusLessThan500(status: number) {
    logInfo(`Expecting status code to be < 500. Received: ${status}`);
    if (status >= 500) {
        logError(`Server error: status code ${status}`);
    }
    expect(status).toBeLessThan(500);
};

export function expectRateLimitStatus(status: number) {
    logInfo(`Validating that status is either 200 or 429. Received: ${status}`);
    if (![200, 429].includes(status)) {
        logError(`Unexpected rate limit status: ${status}`);
    }
    expect([200, 429]).toContain(status);
};

export function expectResponseTime(duration: number, maxTime = 3000) {
    logInfo(`Measuring response time: ${duration}ms (max allowed: ${maxTime}ms)`);
    if (duration >= maxTime) {
        logError(`Response time too high: ${duration}ms`);
    }
    expect(duration).toBeLessThan(maxTime);
};