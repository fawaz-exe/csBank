import express from 'express'

import { customerProfile, getCustomerDetails, updateCustomerDetails, completeProfile, getCustomerAlerts, markAlertAsRead } from '../controllers/customer.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { completeProfileMiddleware } from '../middlewares/register.middleware.js';
import ipPolicyMiddleware from '../middlewares/ipPolicy.middleware.js';

const customerRouter = express.Router();

// customerRouter.use(authMiddleware, ipPolicyMiddleware);
customerRouter.post('/profile', customerProfile)
customerRouter.put('/update', updateCustomerDetails);
customerRouter.get('/:id/alerts', getCustomerAlerts)
customerRouter.put('/alerts/read/:id', markAlertAsRead)
customerRouter.post('/complete-profile', completeProfileMiddleware, completeProfile);
customerRouter.get('/:id', getCustomerDetails)

customerRouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default customerRouter