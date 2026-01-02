import Account from "../models/account.model.js";

const validateAccountAccess = async (req, res, next) => {
  try {
    const accountNumber =
      req.body.fromAccount || req.body.accountNumber;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    }

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (account.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is not active",
      });
    }

    req.account = account;

    next();
  } catch (error) {
    console.error("Account access error:", error);
    res.status(500).json({
      success: false,
      message: "Account validation failed",
    });
  }
};

export default validateAccountAccess;
