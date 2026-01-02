import Account from "../models/account.model.js";

const validateTransferLimit = async (req, res, next) => {
  try {
    const { fromAccount, amount } = req.body;
    const user = req.user;

    const account = await Account.findOne({
      accountNumber: fromAccount,
      userId: user._id,
      status: "ACTIVE",
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized account",
      });
    }


    if (account.transferLimit && amount > account.transferLimit) {
      return res.status(400).json({
        success: false,
        message: "Transfer exceeds per-transaction limit",
      });
    }


    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTotal = account.transactions
      .filter(
        (tx) =>
          tx.type === "DEBIT" &&
          tx.createdAt >= startOfDay
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (
      account.dailyTransferLimit &&
      todayTotal + amount > account.dailyTransferLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Daily transfer limit exceeded",
      });
    }

    req.sourceAccount = account;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Transfer limit validation failed",
    });
  }
};

export default validateTransferLimit;
