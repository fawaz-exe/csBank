import Account from "../models/account.model.js";

const validateBalance = async (req, res, next) => {
  try {
    const user = req.user;
    const { accountNumber, fromAccount, amount } = req.body;


    const sourceAccountNumber = fromAccount || accountNumber;

    if (!sourceAccountNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "Account number and amount are required",
      });
    }

    const account = await Account.findOne({
      accountNumber: sourceAccountNumber,
      userId: user._id,
      status: "ACTIVE",
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or inactive account",
      });
    }

    if (account.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    req.sourceAccount = account;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Balance validation failed",
    });
  }
};

export default validateBalance;
