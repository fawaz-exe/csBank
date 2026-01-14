import express from 'express'
import { getAllCustomers, getCustomerById, lockCustomer, unlockCustomer, resetCustomerPassword, tellerDashboardStats } from '../controllers/teller.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import tellerOnly from '../middlewares/teller.middleware.js'
import ipPolicyMiddleware from '../middlewares/ipPolicy.middleware.js';
import { createCustomerAlert } from '../controllers/customer.controller.js';

const tellerRouter = express.Router();

tellerRouter.use(authMiddleware, tellerOnly);
// tellerRouter.use(ipPolicyMiddleware);
tellerRouter.get('/customers/search', getAllCustomers);
tellerRouter.post('/customers/:id/lock', lockCustomer);
tellerRouter.post('/customers/:id/unlock', unlockCustomer);
tellerRouter.post('/customers/:id/reset-password', resetCustomerPassword);
tellerRouter.get('/dashboard/stats', tellerDashboardStats);
tellerRouter.post('/customers/create-alert', createCustomerAlert)
tellerRouter.get('/customers/:id', getCustomerById);

tellerRouter.use((req,res) => {
    res.status(404).json({error: "Teller route not found ! ⚠️"});
});

export default tellerRouter