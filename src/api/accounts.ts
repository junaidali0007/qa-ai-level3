import { z } from 'zod';

const ApiStatusSchema = z.object({
    responseCode: z.union([z.number(), z.string()]),
    message: z.string().optional(),
});

export interface TestAccountInput {
    name: string;
    email: string;
    password: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname: string;
    lastname: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
}

export class AccountsApiClient {
    constructor(
        private readonly baseUrl: string = process.env.BASE_URL ?? 'https://automationexercise.com',
    ) { }

    private parseBody(rawText: string): unknown {
        try {
            return JSON.parse(rawText);
        } catch {
            throw new Error(`Expected JSON payload from API, received non-JSON response starting with: ${rawText.slice(0, 120)}`);
        }
    }

    async createAccount(account: TestAccountInput): Promise<{ responseCode: number; message: string }> 
    {
        const formBody = new URLSearchParams({
            name: account.name,
            email: account.email,
            password: account.password,
            title: account.title ?? 'Mr',
            birth_date: account.birth_date ?? '10',
            birth_month: account.birth_month ?? '05',
            birth_year: account.birth_year ?? '1995',
            firstname: account.firstname,
            lastname: account.lastname,
            company: account.company ?? 'QA Capstone',
            address1: account.address1,
            address2: account.address2 ?? '',
            country: account.country,
            zipcode: account.zipcode,
            state: account.state,
            city: account.city,
            mobile_number: account.mobile_number,
        });

        const response = await fetch(`${this.baseUrl}/api/createAccount`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formBody.toString(), }); const text = await response.text(); const parsed = ApiStatusSchema.parse(this.parseBody(text)); return { responseCode: Number(parsed.responseCode), message: parsed.message ?? '', };
    } async deleteAccount(email: string, password: string): Promise<{ responseCode: number; message: string }> {
        const formBody = new URLSearchParams({ email, password }); const response = await fetch(`${this.baseUrl}/api/deleteAccount`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString(),
        });

        const text = await response.text();
        const parsed = ApiStatusSchema.parse(this.parseBody(text));
        return {
            responseCode: Number(parsed.responseCode),
            message: parsed.message ?? '',
        };

    }
    async verifyLogin(email: string, password: string,): Promise<{ responseCode: number; message: string }> {
        const formBody = new URLSearchParams({ email, password });

        const response = await fetch(`${this.baseUrl}/api/verifyLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString(),
        });

        const text = await response.text();
        const parsed = ApiStatusSchema.parse(this.parseBody(text));

        return {
            responseCode: Number(parsed.responseCode),
            message: parsed.message ?? '',
        };
    }
}