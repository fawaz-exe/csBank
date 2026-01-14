import Account from "../models/account.model.js"
import Customer from "../models/customer.model.js";

const transferMoney = async(req, res)=>{
    try {
      //  const user = req.user;
      //  const customer = await Customer.findOne({ userId: user._id });

    //    if (!customer) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Customer profile not found",
    //   });
    // }
        const {toAccount, fromAccount, amount, description } = req.body;

        if(fromAccount === toAccount){
          return res.status(403).json({
        success: false,
        message: "You cannot do self Transfer",
      });
        }

          const source = await Account.findOne({
      accountNumber: fromAccount,
    });

    if (!source) {
      return res.status(403).json({
        success: false,
        message: "You have entered wrong account number",
      });
    }

    const destination = await Account.findOne({
      accountNumber: toAccount,
      "status": "active"
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

    const {accountNumber, amount, description } = req.body;
    const account = req.account;
   
    account.balance -= amount;

    
    account.transactionHistory.push({
      type: "debit",
      amount,
      description,
    });

    if(amount > 100000){
        return res.status(400).json({
      success: false,
      message: "Deposit Limit exceeded",
      data: {
        accountNumber,
        withdrawnAmount: amount,
        currentBalance: account.balance,
      },
    })
    }

   
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

    const {accountNumber, amount, description } = req.body;

    const account = req.account;

    account.balance += amount;

    account.transactionHistory.push({
        accountNumber,
      type: "credit",
      amount,
      description,
    });

    if(amount > 100000){
        return res.status(400).json({
      success: false,
      message: "Deposit Limit exceeded",
      data: {
        accountNumber,
        withdrawnAmount: amount,
        currentBalance: account.balance,
      },
    })
    }

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

    const customer = await Customer.findOne({ userId: user._id });

     const { accountId } = req.params;
     console.log('llllllll');
      console.log({customer, accountId})

    const page = parseInt(req.query.page) || 1

    const account = await Account.findOne({
      _id: accountId,
       customerId: customer._id,
      status: "active"
    })
    
    if (!account || account.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account not accessible",
      });
    }
    // req.account = account;

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