import { test, expect } from '@playwright/test';
import { 
    ErrorMessages, 
    BAD_REQUEST, 
    TestUsers, 
    NOT_FOUND 
} from '../apiHelper/constants/index';
import { ReqresClient } from '../apiHelper/clients';
import { 
    createUserPayload, 
    generateAuthData, 
    setupClient 
} from '../apiHelper/utils';
import { expectValidUser } from '../apiHelper/utils/customAssertions';

const invalidLoginData = [
  { email: TestUsers.INVALID_EMAIL, password: '12345', expectedError: BAD_REQUEST },
  { email: TestUsers.EXISTING_EMAIL, password: '', expectedError: BAD_REQUEST },
  { email: '', password: '', expectedError: BAD_REQUEST },
];

test.describe('Functional Tests', () => {
    let client: ReqresClient;

    test.beforeAll(async () => {
        client = await setupClient();
    });

    test('GET - Paginated user list', async () => {
        const res = await client.getUsersPage(1);
        expect(res.data).toBeDefined();
        expect(Array.isArray(res.data)).toBe(true);
        expect(res.page).toBe(1);
    });

    test('GET - Individual user details', async () => {
        const res = await client.getUserId(2);
        expect(res.data).toBeDefined();
        expect(res.data.id).toBe(2);
    });

    test('POST - Create user', async () => {
        const userData = createUserPayload();
        const res = await client.createUser(userData);
        expectValidUser(res);
    });

    test('PUT - Update user', async () => {
        const userData = createUserPayload();
        const res = await client.updateUser(2, userData);
        expect(res).toHaveProperty('updatedAt');
    });

    test('DELETE - Delete user', async () => {
        const res = await client.deleteUser(2);
        expect(res.status()).toBe(204);
    });
});


test.describe('Authentication Tests', () => {
    let client: ReqresClient;

    test.beforeAll(async () => {
        client = await setupClient();
    });

    test('POST /register - Successful registration', async () => {
        const authData = generateAuthData();
        const res = await client.register(authData);
        expect(res).toHaveProperty('id');
        expect(res).toHaveProperty('token');
    });

    test('POST /register - Missing password returns 400', async () => {
        let errorResponse = '';
        try {
            await client.register({ email: TestUsers.EXISTING_EMAIL });
        } catch (error: unknown) {
        if (error instanceof Error) {
            errorResponse = error.message;
        } else {
            throw new Error(ErrorMessages.UNEXPECTED_ERROR_TYPE);
        }
        }
        expect(errorResponse).toContain(BAD_REQUEST);
        expect(errorResponse).toContain(ErrorMessages.MISSING_PASSWORD);
    });

    test('POST /login - Successful login', async () => {
        const authData = generateAuthData();
        const res = await client.login(authData);
        expect(res).toHaveProperty('token');
    });

    // Data-driven invalid login tests
    for (const data of invalidLoginData) {
        test(`POST /login - Invalid login: ${data.email}`, async () => {
        let errorResponse = '';
        try {
            await client.login({ email: data.email, password: data.password });
        } catch (error: unknown) {
            if (error instanceof Error) {
            errorResponse = error.message;
            } else {
            throw new Error(ErrorMessages.UNEXPECTED_ERROR_TYPE);
            }
        }
            expect(errorResponse).toContain(data.expectedError);
        });
    }
});

test.describe('Integration Tests', () => {
    let client: ReqresClient;

    test.beforeAll(async () => {
        client = await setupClient();
    });

    test('User registration and login flow', async () => {
        const authData = generateAuthData();
        const loginRes = await client.login(authData);
        expect(loginRes.token).toBeDefined();
    });

    test('Create -> Update -> Delete user flow', async () => {
        const user = createUserPayload();
        const created = await client.createUser(user);
        expectValidUser(created);

        if (!created.id) {
            throw new Error(ErrorMessages.USER_ID_MISSING);
        }

        const userId = Number(created.id);

        const updated = await client.updateUser(userId, { ...user, job: 'Lead QA' });
        expect(updated).toHaveProperty('updatedAt');

        const deleted = await client.deleteUser(userId);
        expect(deleted.status()).toBe(204);
    });

    test('Register with missing password', async () => {
        try {
            await client.register({ email: TestUsers.EXISTING_EMAIL } as { email: string; password?: string });
        } catch (err: unknown) {
            if (err instanceof Error) {
                expect(err.message).toContain(BAD_REQUEST);
            } else {
                throw new Error(ErrorMessages.UNEXPECTED_ERROR_TYPE);
            }
        }
    });

    test('Request non-existent user returns 404', async () => {
        try {
            await client.getUserId(999);
        } catch (err: unknown) {
            if (err instanceof Error) {
                expect(err.message).toContain(NOT_FOUND);
            } else {
                throw new Error(ErrorMessages.UNEXPECTED_ERROR_TYPE);
            }
        }
    });
});
