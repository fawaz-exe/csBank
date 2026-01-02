import User from "../models/user.model.js"
import Account from "../models/account.model.js"

const transferMoney = async(req, res)=>{
    try {
        const {userId} = req.User
        const { fromAccount, toAccount, amount, description } = req.body;

        if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({
        success: false,
        message: "fromAccount, toAccount and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to same account",
      });
    }

    const source = await Account.findOne({
      accountNumber: fromAccount,
      userId: User._id,   
      status: "ACTIVE"
    });

    if (!source) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to transfer from this account",
      });
    }


    const destination = await Account.findOne({
      accountNumber: toAccount,
      status: "ACTIVE"
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination account not valid",
      });
    }

    if (source.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    source.balance -= amount;
    destination.balance += amount;

    source.transactions.push({
      type: "DEBIT",
      amount,
      description,
      relatedAccount: toAccount,
    });

    destination.transactions.push({
      type: "CREDIT",
      amount,
      description,
      relatedAccount: fromAccount,
    });

    await source.save();
    await destination.save();

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        from: fromAccount,
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
    
    const user = req.user;

    const { accountNumber, amount, description } = req.body;

   
    if (!accountNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "accountNumber and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Withdrawal amount must be greater than zero",
      });
    }

    const account = await Account.findOne({
      accountNumber,
      userId: user._id,
      status: "ACTIVE",
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to withdraw from this account",
      });
    }

   
    if (account.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

   
    account.balance -= amount;

    
    account.transactions.push({
      type: "DEBIT",
      amount,
      description,
      relatedAccount: null, 
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
    const user = req.user;

    const { accountNumber, amount, description } = req.body;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: "accountNumber and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount, amount should be greated than 0",
      });
    }

    const account = await Account.findOne({
      accountNumber,
      userId: user._id,
      status: "ACTIVE",
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to deposit into this account",
      });
    }

    account.balance += amount;

    account.transactions.push({
      type: "CREDIT",
      amount,
      description,
      relatedAccount: null, 
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
    const user = req.user;

    const { accountId } = req.params;


    const account = await Account.findOne({
      _id: accountId,
      userId: user._id,
      status: "ACTIVE",
    });

    if (!account) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this account",
      });
    }

    const transactions = account.transactions
      .sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        transactions,
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



export { transferMoney, withdrawMoney, depositMoney, getAccountTransactions };
