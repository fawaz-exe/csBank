import dotenv from 'dotenv';
dotenv.config({ path: '../.env_test' });

import Customer from '../models/customer.model.js';

import { describe, jest, test } from '@jest/globals'
import request from 'supertest'

//unstable_mockModule

await jest.unstable_mockModule('../middlewares/auth.middleware.js', () => (
    {
        default: (req, res, next) => {

            req.user = { id: '123', name: 'Test User', role: 'user' },
                next()
        }

    }
))

const { default: app } = await import('../app.js');

describe('API : Create Account', () => {
    test('should create account successfully', async () => {
        const details = {
            userId: "6989cba34b4d03e2fdbe7a26",
            accountType: "current"
        }
        const res = await request(app)
            .post('/api/accounts/create-account')
            .send(details)

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    })
})


describe("API Account Details", () => {
    test("should return Account details successfully", async () => {
        const res = await request(app).get("/api/accounts/account/6989d4394754e86a13ecfa4e");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true); //6946d6d1d19787d511f649c7, 6989cba34b4d03e2fdbe7a2a
        expect(res.body.data.customerId._id).toBe("6989cba34b4d03e2fdbe7a2a");
    })
})

describe("API : GET Customer Accounts ", () => {
    test("should return Customer Accounts successfully", async () => {
        const res = await request(app)
        .get("/api/accounts/account/customer/6989cba34b4d03e2fdbe7a2a");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true)
        expect(res.body.data[0].customerId).toBe("6989cba34b4d03e2fdbe7a2a");

    })
})