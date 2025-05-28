import { request } from '@playwright/test';
import { ReqresClient } from './clients/index';

export async function setupClient() {
    const context = await request.newContext({
        baseURL: process.env.BASE_URL,
    });
    return new ReqresClient(context);
};