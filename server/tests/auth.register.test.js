import {jest} from '@jest/globals'
import request from 'supertest';
import app from "../app.js";
import User from "../models/user.model.js";

// / Mocking => Isolating or Ignoring your external services;

jest.mock('../workers/send.email.js', ()=>(
    {
        default: jest.fn(()=> Promise.resolve())
    }
))

jest.mock('../workers/send.sms.js', ()=>(
    {
        default: jest.fn(()=> Promise.resolve())
    }
))

describe("Register Customer API", ()=>{
    const validUser = {
        email: "test1@gmail.com",
        password: "Password@123",
        firstName: "Test User",
        lastName: "Khan",
        dateOfBirth: "2000-01-01",
        phone: "7869885321",
        address: {
            street: "Nizam Colony",
            city: "Hyderabad",
            state: "TG",
            pinCode: "500007"
        }
    };

    test('Should Register Successfully', async ()=>{
        const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    })

})
