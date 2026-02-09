import express from 'express'

const docRouter = express.Router()


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register Customer
 *     description: Register a new User and Customer for csBank
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             firstName: user
 *             lastName: test
 *             email: test.user@gmail.com
 *             password: Hello@#12
 *             phone: 15935784620
 *             dateOfBirth: 1947-08-15
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Customer Registered successfully. Please check your Email & Phone-SMS. Verification is required !
 *               data:
 *                 userId: 698a31f31e30a80febe4e6d7
 *                 firstName: user
 *                 lastName: test
 *                 dateOfBirth: 1947-08-15T00:00:00.000Z
 *                 status: pending
 *                 customerSince: 2026-02-09T19:13:55.606Z
 *                 _id: 698a31f31e30a80febe4e6db
 *                 createdAt: 2026-02-09T19:13:55.606Z
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 * 
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Login using email and password. Email and phone must be verified to login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user@example.com
 *             password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User login successfull
 *               data:
 *                 _id: string
 *                 email: user@example.com
 *                 role: customer
 *                 jwtToken: string
 *       400:
 *         description: Email or phone not verified
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the currently authenticated user.
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: JWT authentication token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User logged out successfully
 *               data:
 *                 _id: string
 *                 email: user@example.com
 *                 role: customer
 *       500:
 *         description: Internal server error
 * 
 * /api/auth/me:
 *   get:
 *     summary: Get current user details
 *     description: Fetches details of the currently logged-in user along with related customer data.
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: JWT authentication token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Fetched current User Details
 *               data:
 *                 user:
 *                   _id: 698829042cc254399e1c7f89
 *                   email: test.user@gmail.com
 *                   phone: "+9195135784620"
 *                   role: customer
 *                   isActive: true
 *                   lastLogin: "2026-02-09T20:03:53.664Z"
 *                   loginHistory:
 *                     - {}
 *                 customer:
 *                   _id: 698829042cc254399e1c7f8d
 *                   userId: 698829042cc254399e1c7f89
 *                   firstName: test
 *                   lastName: user
 *                   dateOfBirth: "21947-08-15T00:00:00.000Z"
 *                   status: pending
 *                   customerSince: "2026-02-08T06:11:16.117Z"
 *                   createdAt: "2026-02-08T06:11:16.117Z"
 *                   alerts: []
 *                   debitCard:
 *                     - cardNumber: CS241770532505855
 *                       cvv: "118"
 *                       isActive: true
 *                       dailyLimit: 50000
 *                       _id: 69882e99470bbbaeba2c1199
 *                   updatedAt: "2026-02-09T12:10:09.273Z"
 *                   __v: 1
 *       401:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * 
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer details by ID
 *     description: Fetches customer personal details, linked user info, account details, and debit card details using customer ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *           example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Customer details fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Customer Details 
 *               data:
 *                 firstName: Test User
 *                 lastName: Khan
 *                 dateOfBirth: "2000-01-01T00:00:00.000Z"
 *                 address:
 *                   street: Colony
 *                   city: hyd
 *                   state: tg
 *                   pinCode: "500007"
 *                 customer_status: pending
 *                 customer_since: "2026-02-09T10:40:31.012Z"
 *                 email: test.user@gmail.com
 *                 phone: "+911234567890"
 *                 role: customer
 *                 isActive: true
 *                 account: null
 *                 debitCard: []
 *       401:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Customer not found!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: Internal server error
 */


// -----------------------------------------------------------------------------------------------------------------
// docRouter.post("/register", (req, res) => {
//   res.status(201).json({
//     success: true,
//     message:
//       "Customer Registered successfully. Please check your Email & Phone-SMS. Verification is required !",
//     data: {
//       userId: "698a31f31e30a80febe4e6d7",
//       firstName: "test",
//       lastName: "user",
//       dateOfBirth: "2006-08-31T00:00:00.000Z",
//       status: "pending",
//       customerSince: "2026-02-09T19:13:55.606Z",
//       _id: "698a31f31e30a80febe4e6db",
//       createdAt: "2026-02-09T19:13:55.606Z",
//     },
//   });
// });


export default docRouter