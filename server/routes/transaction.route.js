import express from "express";
import {
  depositMoney,
  withdrawMoney,
  transferMoney,
  getAccountTransactions,
} from "../controllers/transaction.controller.js";
import validateBalance from "../middlewares/balance.middleware.js";

import validateTransferLimit from "../middlewares/transferLimit.middleware.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/deposit", authMiddleware, depositMoney);

transactionRouter.post("/withdraw", authMiddleware, validateBalance, withdrawMoney);

transactionRouter.post("/transfer", authMiddleware, validateBalance, validateTransferLimit, transferMoney);

transactionRouter.get("/account/:accountId", authMiddleware, getAccountTransactions);

transactionRouter.use((req, res)=>{
    res.status(404).json({error: "Route not found!"});
})

export default transactionRouter
