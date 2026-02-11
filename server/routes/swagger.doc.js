import express from 'express'

const docRouter = express.Router()


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register Customer
 *     description: Register a new User and Customer for csBank.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             firstName: user
 *             lastName: dev
 *             email: user.dev@gmail.com
 *             password: Hello@#12
 *             phone: "9999999999"
 *             dateOfBirth: "1947-08-15"
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Customer Registered successfully. Please check your Email & Phone-SMS. Verification is required!
 *               data:
 *                 userId: "698a31f31e30a80febe4e6d7"
 *                 firstName: user
 *                 lastName: dev
 *                 dateOfBirth: "1947-08-15T00:00:00.000Z"
 *                 status: pending
 *                 customerSince: "2026-02-09T19:13:55.606Z"
 *                 _id: "698a31f31e30a80febe4e6db"
 *                 createdAt: "2026-02-09T19:13:55.606Z"
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 *
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Login using email and password. Email and phone must be verified to login.
 *     tags:
 *       - Authentication
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
 *               message: User login successful
 *               data:
 *                 _id: "698c8763aede0f23e9974baa"
 *                 email: user@gmail.com
 *                 phone: "+91999999999"
 *                 role: customer
 *                 isActive: true
 *                 jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email or phone not verified
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current user details
 *     description: Fetch details of the currently logged-in user along with related customer data.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *       401:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer details by ID
 *     description: Fetch customer personal details, linked user info, account details, and debit card details using customer ID.
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     responses:
 *       200:
 *         description: Customer details fetched successfully
 *       401:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 *
 * /api/customers/update:
 *   put:
 *     summary: Update customer details
 *     description: Update the logged-in customer's personal information.
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           example:
 *             firstName: LENOVO
 *             lastName: IDEAPAD
 *             phone: "+919876543210"
 *             dateOfBirth: "2000-01-01"
 *             address:
 *               street: Ameerpet
 *               city: Hyderabad
 *               state: Telangana
 *               pinCode: "500016"
 *     responses:
 *       200:
 *         description: Customer details updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 *
 * /api/accounts/create-account:
 *   post:
 *     summary: Create Bank Account
 *     description: Allows a registered customer to create a new bank account (Savings or Current). A debit card is automatically generated.
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "698c8763aede0f23e9974baa"
 *             accountType: "savings"
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid account type
 *       403:
 *         description: Only customers can create accounts
 *       500:
 *         description: Internal server error
 *
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the currently authenticated user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal server error
 * 
 * 
 * /api/accounts/account/{id}:
 *   get:
 *     summary: Get account details by ID
 *     description: Fetches bank account details using the account ID.
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account ID
 *         schema:
 *           type: string
 *           example: 6989d4394754e86a13ecfa4e
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: JWT authentication token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Account fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Account fetched successfully
 *               data:
 *                 _id: "6989d4394754e86a13ecfa4e"
 *                 customerId:
 *                   _id: "6989cba34b4d03e2fdbe7a2a"
 *                 accountNumber: "CS241770640441700"
 *                 accountType: "current"
 *                 balance: 1000
 *                 transferLimit: 50000
 *                 withdrawalLimit: 100000
 *                 depositLimit: 100000
 *                 status: "pending"
 *                 transactionHistory: []
 *                 __v: 0
 *       400:
 *         description: Account not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Account not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 * 
 * /api/accounts/account/customer/{customerId}:
 *   get:
 *     summary: Get All Accounts by Customer ID
 *     description: Fetch all bank accounts associated with a specific customer.
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Customer ID
 *       - in: header
 *         name: auth-token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT authentication token
 *     responses:
 *       200:
 *         description: Accounts fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Accounts fetched successfully"
 *               data:
 *                 - _id: "6989d1f3b95a6fabe7dc0803"
 *                   customerId: "6989cba34b4d03e2fdbe7a2a"
 *                   accountNumber: "CS241770639859989"
 *                   accountType: "savings"
 *                   balance: 1000
 *                   transferLimit: 50000
 *                   withdrawalLimit: 100000
 *                   depositLimit: 100000
 *                   status: "pending"
 *                   transactionHistory: []
 *       404:
 *         description: No accounts found for this customer
 *       500:
 *         description: Internal server error
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