import User from "../models/user.model.js";
import Customer from "../models/customer.model.js"
import Account from "../models/account.model.js";
import token from "../utils/token.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
import sendEmail from "../workers/send.email.js";
import bcrypt from "bcrypt"

import dotenv from 'dotenv'
dotenv.config();

const seedPassword = process.env.SEED_PASSWORD;

const customerProfile = async(req,res) => {
    try {
        const user = req.user;
        const {address, firstName, lastName, phone, dateOfBirth} = req.body;

        const customer = await Customer.findOne({userId: user._id});

        if(!customer){
            console.log("Customer not found !");
            return res.status(401).json({success: false, message: "Customer not found!"});
        }

        
        
        if (address) customer.address = address;
        
        await customer.save();
        console.log("Profile Details saved ! ");
        return res.status(200).json({success: true, message: "Profile Details saved ! ", data: customer})
        } 
        catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error.message, data : "Internal server error"})
    }
}

const getCustomerDetails = async(req,res) => {
    try {
        let customerId = req.params.id;

        const customer = await Customer.findById(customerId)
        .populate("userId", "email phone role isActive");
        if(!customer){
             console.log("Customer not found !");
            return res.status(401).json({success: false, message: "Customer not found!"});
        }

        const account = await Account.findOne({customerId: customer._id});
        
        let accountDetails = null
        if(account){
            const {balance, transferLimit, withdrawalLimit, depositLimit, createdAt, updatedAt, ...otherData} = account.toObject()
            accountDetails = otherData
        }

        // const response = {customer, accountDetails}
        const response = {
            firstName : customer.firstName,
            lastName : customer.lastName,
            dateOfBirth: customer.dateOfBirth,
            address: customer.address,
            customer_status: customer.status,
            customer_since: customer.customerSince,
            email: customer.userId.email,
            phone: customer.userId.phone,
            role: customer.userId.role,
            isActive: customer.userId.isActive,
            account: accountDetails,
            debitCard : customer.debitCard
        }

        console.log("Customer Details : ", response);
        return res.status(200).json({success: true, message: "Customer Details : ", data: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error.message, data : "Internal server error"})
    }
}

// Use this when Customer doesn't exist yet (first login)
const completeProfile = async (req, res) => {
    try {
        const userId = req.body._id
        const { firstName, lastName, dateOfBirth, address } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Check if already completed
        if (user.profileCompleted) {
            return res.status(409).json({
                success: false,
                message: "Profile already completed. Use update endpoint instead."
            });
        }
        
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ userId });
        if (existingCustomer) {
            return res.status(409).json({ 
                success: false, 
                message: "Customer profile already exists" 
            });
        }
        
        // Validate required fields
        if (!firstName || !dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: "First name and date of birth are required"
            });
        }
        
        // CREATE new customer
        const customer = await Customer.create({
            userId: userId,
            firstName,
            lastName: lastName || "",
            dateOfBirth,
            address: {
                street: address?.street || "",
                city: address?.city || "",
                state: address?.state || "",
                pinCode: address?.pinCode || ""
            },
            customerSince: new Date(),
            createdAt: new Date()
        });
        
        // Mark profile as completed
        await User.findByIdAndUpdate(userId, { 
            profileCompleted: true,
            updatedAt: new Date()
        });
        
        return res.status(201).json({
            success: true,
            message: "Profile completed successfully! You can now create your account.",
            data: customer
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: error,
            data: "Internal server error from completeProfileController"
        });
    }
};


const updateCustomerDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;

    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found!" });
    }


    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (phone) customer.phone = phone;
    if (dateOfBirth) customer.dateOfBirth = dateOfBirth;

if (address) {
    if(!customer.address){
        customer.address = {}
    }

  if (address.street) customer.address.street = address.street;
  if (address.city) customer.address.city = address.city;
  if (address.state) customer.address.state = address.state;
  if (address.pinCode) customer.address.pinCode = address.pinCode;
}


    await customer.save();

    return res.status(200).json({ success: true,
      message: "Customer details updated successfully",
      data: customer
    });

  } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error.message, data : "Internal server error"})
    }
}

export const createCustomerAlert = async (req, res) => {
    try {
        const { customerId, type, message } = req.body;


        if (!customerId || !type || !message) {
            return res.status(400).json({
                success: false,
                message: "customerId, type and message are required"
            });
        }

        if (!["low_balance", "large_transaction", "security"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert type"
            });
        }


        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }


        customer.alerts.push({
            type,
            message,
            isRead: false,
            createdAt: new Date()
        });

        customer.updatedAt = new Date();
        await customer.save();

        return res.status(201).json({
            success: true,
            message: "Alert created successfully",
            data: customer.alerts[customer.alerts.length - 1]
        });

    } catch (error) {
        console.error("createCustomerAlert error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getCustomerAlerts = async (req, res) => {
    try {
        const customerId = req.params.id;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required"
            });
        }

        const customer = await Customer.findById(
            customerId,
            { alerts: 1, firstName: 1, lastName: 1 }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Sort alerts
        const alerts = customer.alerts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.status(200).json({
            success: true,
            message: "Customer alerts fetched successfully",
            total: alerts.length,
            data: alerts
        });

    } catch (error) {
        console.error("getCustomerAlerts error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const markAlertAsRead = async (req, res) => {
    try {
        const alertId = req.params.id;

        if (!alertId) {
            return res.status(400).json({
                success: false,
                message: "Alert ID is required"
            });
        }

        const customer = await Customer.findOne({
            "alerts._id": alertId
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        const alert = customer.alerts.id(alertId);
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        alert.isRead = true;
        customer.updatedAt = new Date();

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Alert marked as read",
            data: alert
        });

    } catch (error) {
        console.error("markAlertAsRead error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { customerProfile, getCustomerDetails, updateCustomerDetails, completeProfile };