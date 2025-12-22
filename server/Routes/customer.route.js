import express from 'express'

import { customerProfile, getCustomerDetails } from '../controllers/customerController.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const customerRouter = express.Router();

customerRouter.post('/profile',authMiddleware, customerProfile)
customerRouter.get('/:id',authMiddleware, getCustomerDetails)


customerRouter.use((req,res) => {
    res.status(404).json({error: "Route not found ! ⚠️"});
});

export default customerRouter