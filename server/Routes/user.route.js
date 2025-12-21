import express from 'express'

import { registerCustomer, verifyEmail, loginUser, verifyJWTToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset } from '../controllers/customerController.js'
import { newPasswordMiddleware } from '../middlewares/error.middleware.js';
import { loginMiddleware } from '../middlewares/login.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const arouter = express.Router();

arouter.post('/register', registerCustomer);
arouter.get('/verify/email/:token', verifyEmail);
arouter.post('/login', loginMiddleware, loginUser);
arouter.get('/jwt', verifyJWTToken);
arouter.post('/logout', authMiddleware, logoutUser);
arouter.post('/me', authMiddleware, currentUser);

// password reset routes

arouter.post('/password/reset-request', authMiddleware, passwordResetRequest);
arouter.get('/verify/password/:token', authMiddleware, passwordVerify);
arouter.post('/reset-password', authMiddleware, newPasswordMiddleware, passwordReset);


arouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default arouter