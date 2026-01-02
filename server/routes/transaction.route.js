import express from "express";
import {depositMoney,withdrawMoney,transferMoney,getAccountTransactions,
} from "../controllers/transaction.controller.js";

import validateBalance from "../middlewares/balance.middleware.js";
import validateTransferLimit from "../middlewares/transferLimit.middleware.js";
import validateAccountAccess from "../middlewares/account.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/deposit", authMiddleware, validateAccountAccess, depositMoney);

transactionRouter.post("/withdraw", authMiddleware, validateAccountAccess, validateBalance, withdrawMoney);

transactionRouter.post("/transfer", authMiddleware, validateAccountAccess, validateBalance, validateTransferLimit, transferMoney);

transactionRouter.get("/account/:accountNumber", authMiddleware, validateAccountAccess, getAccountTransactions);

transactionRouter.use((req, res)=>{
    res.status(404).json({error: "Route not found!"});
})

export default transactionRouter
