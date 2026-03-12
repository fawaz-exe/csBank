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

describe("API : Deposit Money", () => {
    test("Should Deposit Money successfully", async () => {
        const details = {
            accountNumber: "CS241770641073064",
            amount: "520"
        }
        const res = await request(app)
        .post('/api/transactions/deposit')
        .send(details);

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe("API : Transfer Money", () => {
    test("Should Transfer Money successfully", async () => {
        const details = {
            fromAccount: "CS241770641073064",
            toAccount: "CS241770641047128",
            amount: "520"
        }
        const res = await request(app)
        .post('/api/transactions/transfer')
        .send(details);

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe("API : Withdraw Money", () => {
    test("Should Withdraw Money successfully", async () => {
        const details = {
            accountNumber: "CS241770641073064",
            amount: "520"
        }
        const res = await request(app)
        .post('/api/transactions/withdraw')
        .send(details);

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe("API : GET Account Transactions ", () => {
    test("Should return Account Transactions successfully", async () => {
        
        const res = await request(app)
        .post('/api/transactions/account/6989d8a4ea55f3553e6ed647')

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })
})