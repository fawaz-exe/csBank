import express from 'express'

import { registerCustomer, verifyEmail, loginUser, verifyJWTToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset } from '../controllers/customerController.js'
import { newPasswordMiddleware } from '../middlewares/error.middleware.js';
import { loginMiddleware } from '../middlewares/login.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerCustomer);
authRouter.get('/verify/email/:token', verifyEmail);
authRouter.post('/login', loginMiddleware, loginUser);
authRouter.get('/jwt', verifyJWTToken);
authRouter.post('/logout', authMiddleware, logoutUser);
authRouter.post('/me', authMiddleware, currentUser);

// password reset routes-----------------------------------------------------------------

authRouter.post('/password/reset-request', authMiddleware, passwordResetRequest);
authRouter.get('/verify/password/:token', authMiddleware, passwordVerify);
authRouter.post('/reset-password', authMiddleware, newPasswordMiddleware, passwordReset);

// -----------------------------------------------------------------


authRouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default authRouter