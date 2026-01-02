import express from "express"
import {getAccountById, getAccountsByCustomer, createAccount} from "../controllers/account.controller.js"

const accountRouter = express.Router()

accountRouter.post('/create-account', createAccount)
accountRouter.get('/account/:id', getAccountById)
accountRouter.get('/account/customer/:customerId', getAccountsByCustomer)

accountRouter.use((req, res)=>{
    res.status(404).json({error: "Route not found ! ⚠️"});
})

export default accountRouter