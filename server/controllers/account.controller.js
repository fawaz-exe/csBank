import Account from "../models/account.model.js";
import Customer from "../models/customer.model.js";
import generateThreeDigitNumber from "../utils/cvv.utils.js";

const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;

    const account = await Account.findById(accountId).populate("customerId", "firstname lastname phone")

    if(!account){
        return res.status(400).json({
            success: false,
            message: "Account not found",
            // error: error.data
        })
    }

    return res.status(200).json({
        success: true,
        message: "Account fetched successfully",
        data: account
    })
  } catch (error) {
   console.log(error);
   return res.status(500).json({
    success: false,
    message: "Internal server error",
    // error: error.data
   })
  }
};

const createAccount = async (req, res) => {
  try {
    
    const {userId, accountType} = req.body

    if(!(accountType == "SAVINGS" || accountType == "CURRENT" || accountType == "savings" || accountType == "current")){
        return res.status(400).json({
            success: false,
            message: "Invalid account type",
            // error: error?.data
        })    
    }

    const customer = await Customer.findOne({userId})
    if(!customer){
        return res.status(403).json({
            success: false,
            message: "Only customers can create accounts",
            // error: error.data
        })
    }

    const accountNumber = `CS24${Date.now()}`

    const account = await Account.create({
        customerId: customer._id,
        accountNumber,
        accountType: accountType.toLowerCase(),
        balance: 1000,
    })

    const CVV = generateThreeDigitNumber();

    const debitCard = {
        cardNumber : accountNumber,
        cvv : CVV.toString(),
        isActive: true
    }

    customer.debitCard.push(debitCard)
    await customer.save();

    return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: account
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "internal server error",
        // error: error.data
    })
  }
};


//Get all accounts of a customer using one customer id

const getAccountsByCustomer = async (req, res)=>{
    try {
        const customerId = req.params.customerId
        const accounts = await Account.find({customerId})

        if(!accounts){
            return res.status(404).json({
                success: false,
                message: "No accounts found for this customer",
                // error: error.data
            })
        }

        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            data: accounts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            // error: error.data
        })
    }
}

export {getAccountsByCustomer, createAccount, getAccountById}