import express from 'express'

import { registerCustomer, verifyEmail, loginUser, verifyJwtToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset } from '../controllers/auth.controller.js'
import { newPasswordMiddleware } from '../middlewares/newPassword.middleware.js';
import { loginMiddleware } from '../middlewares/login.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import registerMiddleware from '../middlewares/register.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerMiddleware, registerCustomer);
authRouter.get('/verify/email/:token', verifyEmail);
authRouter.post('/login', loginMiddleware, loginUser);
authRouter.get('/jwt', verifyJwtToken);
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