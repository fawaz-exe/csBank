import Account from "../models/account.model.js";

const validateTransferLimit = (req, res, next) => {
  const { amount } = req.body;
  const account = req.account;

  if (account.transferLimit && amount > account.transferLimit) {
    return res.status(400).json({
      success: false,
      message: "Transfer limit exceeded",
    });
  }

  next();
};

export default validateTransferLimit;