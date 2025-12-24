import Account from "../models/account.model.js";
import Customer from "../models/customer.model.js";

const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;

    const account = await Account.findById(accountId).populate("customerId", "firstname lastname phone")

    if(!account){
        return res.status(400).json({
            success: false,
            message: "Account not found"
        })
    }

    return res.status(200).json({
        success: true,
        data: account
    })
  } catch (error) {
   console.log(error);
   return res.status(500).json({
    success: false,
    message: "Internal server error"
   })
  }
};

const createAccount = async (req, res) => {
  try {
    
    const {userId, accountType} = req.body

    if(accountType !== "SAVINGS" || accountType !== "CURRENT"){
        return res.status(400).json({
            success: false,
            message: "Invalid account type"
        })    
    }

    const customer = await Customer.findOne({userId})
    if(!customer){
        return res.status(403).json({
            success: false,
            message: "Only customers can create accounts"
        })
    }

    const accountNumber = `CS24${Date.now()}`

    const account = await Account.create({
        customerId: customer._id,
        accountNumber,
        accountType,
        balance: 1000,
    })

    return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: account
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "internal server error"
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
                message: "No accounts found for this customer"
            })
        }

        return req.status(200).json({
            success: true,
            data: accounts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export {getAccountsByCustomer, createAccount, getAccountById}