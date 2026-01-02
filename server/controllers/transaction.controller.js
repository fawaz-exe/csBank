import User from "../models/user.model.js"
import Account from "../models/account.model.js"

const transferMoney = async(req, res)=>{
    try {
       
        const {toAccount, amount, description } = req.body;



    const destination = await Account.findOne({
      accountNumber: toAccount,
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination account not valid",
      });
    }

    source.balance -= amount;
    destination.balance += amount;

    source.transactionHistory.push({
      type: "debit",
      amount,
      description,
      relatedAccount: toAccount,
    });

    destination.transactionHistory.push({
      type: "credit",
      amount,
      description,
      relatedAccount: source.accountNumber,
    });

    await source.save();
    await destination.save();

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        from: source.accountNumber,
        to: toAccount,
        amount,
      },
    });

    } catch (error) {
        console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.data
    });
    }
}

const withdrawMoney = async (req, res) => {
  try {

    const {amount, description } = req.body;
    const account = req.account;
   
    account.balance -= amount;

    
    account.transactionHistory.push({
      type: "debit",
      amount,
      description,
    });

   
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal successful",
      data: {
        accountNumber,
        withdrawnAmount: amount,
        currentBalance: account.balance,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const depositMoney = async (req, res) => {
  try {

    const {amount, description } = req.body;
    const account = req.account;

    account.balance += amount;

    account.transactionHistory.push({
      type: "credit",
      amount,
      description,
    });

    await account.save();

    return res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: {
        accountNumber,
        depositedAmount: amount,
        currentBalance: account.balance,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.data
    });
  }
};

const getAccountTransactions = async (req, res) => {
  try {

    const account = req.account;

    const transactionHistory = account.transactionHistory
      .sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        transactionHistory,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.data
    });
  }
};



export { transferMoney, withdrawMoney, depositMoney, getAccountTransactions };
