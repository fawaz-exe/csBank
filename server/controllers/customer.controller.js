import User from "../models/user.model.js";
import Customer from "../models/customer.model.js"
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

        const customer = await Customer.findById(customerId);
        if(!customer){
             console.log("Customer not found !");
            return res.status(401).json({success: false, message: "Customer not found!"});
        }

        console.log("Customer Details : ", customer);
        return res.status(200).json({success: true, message: "Customer Details : ", data: customer});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error.message, data : "Internal server error"})
    }
}


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

export {customerProfile, getCustomerDetails, updateCustomerDetails}