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

describe("API Customer Details", () => {
    test("GET Customer details successfully", async () => {
        const res = await request(app).get("/api/customers/6989b99fb56626b6cf0c26cb");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true)
    })
})

//pending
// describe('API : Update Customer Details', () => { 
//     test("should update customer details successfully", async () => {
//         const updateInfo = {
//             firstName: "tester"
//         }
//         const res = await request(app)
//         .put('/api/customers/update')
//         .send(updateInfo)

//         expect(res.statusCode).toBe(200);
//         expect(res.body.success).toBe(true);
//         expect(res.body.data.firstName).toBe('tester');
//     })
//  })






