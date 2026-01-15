import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminOnly from '../middlewares/admin.middleware.js'

import { deleteUserByAdmin, manageIpPolicy, createUserByAdmin, getLoginLogs, getAllUsers, getAllIpPolicies } from '../controllers/admin.controller.js'
import ipPolicyMiddleware from '../middlewares/ipPolicy.middleware.js';

const adminRouter = express.Router();

adminRouter.use(authMiddleware, adminOnly);
// adminRouter.use(ipPolicyMiddleware);
adminRouter.delete('/users/:id', deleteUserByAdmin);
adminRouter.post('/ip-policies', manageIpPolicy);
adminRouter.post('/users/create', createUserByAdmin);
adminRouter.get('/login-logs', getLoginLogs)
adminRouter.get('/all-users', getAllUsers);
adminRouter.get('/ip-policies', getAllIpPolicies);

adminRouter.use((req, res) => {
    res.status(404).json({error: "Admin route not found ! ⚠️"});
});

export default adminRouter