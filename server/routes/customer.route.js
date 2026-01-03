import express from 'express'

import { customerProfile, getCustomerDetails, updateCustomerDetails, completeProfile } from '../controllers/customer.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { completeProfileMiddleware } from '../middlewares/register.middleware.js';

const customerRouter = express.Router();

customerRouter.post('/profile',authMiddleware, customerProfile)
customerRouter.get('/:id',authMiddleware, getCustomerDetails)
customerRouter.put('/update', authMiddleware, updateCustomerDetails);
customerRouter.post('/complete-profile', authMiddleware, completeProfileMiddleware, completeProfile);

customerRouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default customerRouter