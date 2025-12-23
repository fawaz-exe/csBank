import express from 'express'

import { customerProfile, getCustomerDetails, updateCustomerDetails } from '../controllers/customer.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const customerRouter = express.Router();

customerRouter.post('/profile',authMiddleware, customerProfile)
customerRouter.get('/:id',authMiddleware, getCustomerDetails)
customerRouter.put('/update', authMiddleware, updateCustomerDetails);

customerRouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default customerRouter