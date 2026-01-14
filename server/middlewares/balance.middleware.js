import Account from "../models/account.model.js";

const validateBalance = (req, res, next) => {
  const { amount } = req.body;
  const account = req.account;

  if (account.balance < amount) {
    return res.status(400).json({
      success: false,
      message: "Insufficient balance"
    });
  }

  next();
};

export default validateBalance