// import dotenv from 'dotenv';
// dotenv.config({ path: '../.env_test' });

import { describe, expect, jest } from '@jest/globals'
import request from 'supertest';
// import app from "../app.js";
import User from "../models/user.model.js";
import Customer from '../models/customer.model.js';

// / Mocking => Isolating or Ignoring your external services;

jest.mock('../workers/send.email.js', () => (
    {
        default: jest.fn(() => Promise.resolve())
    }
))

jest.mock('../workers/send.sms.js', () => (
    {
        default: jest.fn(() => Promise.resolve())
    }
))

await jest.unstable_mockModule('../middlewares/auth.middleware.js', () => (
    {
        default: (req, res, next) => {

            req.user = {
                id: '6989b5fe097102fdc43ad222',
                email: 'testinggss@gmail.com',
                role: 'customer',
            };
            next()
        }

    }
))

const { default: app } = await import('../app.js');

// beforeEach(async () => {
//   await User.deleteMany({});
//   await Customer.deleteMany({});
// });

const validUser = {
    email: "testinggss@gmail.com",
    password: "Password@123",
    firstName: "Test User",
    lastName: "Khan",
    dateOfBirth: "2000-01-01",
    phone: "7869880321",
    address: {
        street: " Colony",
        city: "hyd",
        state: "tg",
        pinCode: "500007"
    }
};


describe("API : Register Customer ", () => {

    test('Should Register Successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(validUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    })

})

describe('API : Verify Email', () => {
    test('should verify email successfully', async () => {
        await request(app)
            .post('/api/auth/register')
            .send(validUser);

        const user = await User.findOne({ email: validUser.email });
        expect(user).not.toBeNull();

        const emailToken = user.verifyToken.email;

        const res = await request(app)
            .get(`/api/auth/verify/email/${emailToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const updatedUser = await User.findOne({ email: validUser.email });
        expect(updatedUser.verified.email).toBe(true)
    })
})

describe('API : Verify Phone', () => {
    test('should verify phone successfully', async () => {
        await request(app)
            .post('/api/auth/register')
            .send(validUser);

        const user = await User.findOne({ email: validUser.email });
        expect(user).not.toBeNull();

        const phoneToken = user.verifyToken.phone;

        const res = await request(app)
            .get(`/api/auth/verify/phone/${phoneToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        const updatedUser = await User.findOne({ email: validUser.email });
        expect(updatedUser.verified.phone).toBe(true)
    })
})


describe('API : Login', () => {
    test('should return user login successfull', async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "testinggss@gmail.com",
                password: "Password@123"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    })
})


describe("API : Get Current User ", () => {
    test('should return logged-in user details', async () => {
        const res = await request(app)
            .get('/api/auth/me')

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe("testinggss@gmail.com");


    })
})

// logout is pending
// describe('API : Logout', () => {
//     test('should return user logout successfull', async () => {
//         const res = await request(app)
//             .post("/api/auth/logout")


//         expect(res.statusCode).toBe(200);
//         expect(res.body.success).toBe(true);
//         expect(res.body.data.email).toBe("testinggss@gmail.com");

//     })
// })
