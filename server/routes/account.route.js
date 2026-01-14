import express from "express"
import {getAccountById, getAccountsByCustomer, createAccount} from "../controllers/account.controller.js"
import ipPolicyMiddleware from "../middlewares/ipPolicy.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const accountRouter = express.Router()

accountRouter.use(authMiddleware)
accountRouter.use(ipPolicyMiddleware);
accountRouter.post('/create-account', createAccount)
accountRouter.get('/account/:id', getAccountById)
accountRouter.get('/account/customer/:customerId', getAccountsByCustomer)

accountRouter.use((req, res)=>{
    res.status(404).json({error: "Route not found ! ⚠️"});
})

export default accountRouter