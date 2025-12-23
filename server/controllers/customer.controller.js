import userModel from "../models/user.model.js";
import customerModel from "../models/customer.model.js"
import token from "../utils/token.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
import sendEmail from "../workers/send.email.js";
import bcrypt from "bcrypt"

import dotenv from 'dotenv'
dotenv.config();

const registerCustomer = async(req,res) => {
    try {
        const {userId, firstName, lastName, dateOfBirth, phone, address} = req.body;

        const existingUser = await userModel.findById(req.body.userId);
        if(!existingUser){
                console.log("User not found !");
            return res.status(401).json({error: "User not found!"});
        }

        const existingCustomer = await customerModel.findOne({userId: req.body.userId})
        if(existingCustomer){
            console.log("You are already Registered as a Customer !");
            return res.status(401).json({error: "You are already Registered as a Customer !"});
        }

        

        const customer = await customerModel.create({
            userId, firstName, lastName, dateOfBirth, phone, address,
            customerSince: new Date()
        });

        let emailtoken = token();
        await userModel.findByIdAndUpdate(userId, {"verifyToken.email": emailtoken})

        sendEmail({
            to: existingUser.email,
            subject : 'Email Confirmation',
            body: `
            Hello ${req.body.firstname}<br>
            Please click this <a href = "http://localhost:6040/api/auth/verify/email/${emailtoken}">Click Me</a>
            <br>
            Thankyou :)
            `
        });


        console.log("Customer Registered successfully. Email Verification required !");
        return res.status(201).json({success : true, 
        message: "Customer Registered successfully. Email Verification required !", data: customer
    });        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}


const verifyEmail = async(req,res) => {
    try {
        let token = req.params.token;
        const user = await userModel.findOne({'verifyToken.email': token})
        user.verified.email = true
        await user.save();

        res.status(200).send(`<h1>Email is verified successfully 👍! </h1>`)
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}


const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
                console.log("User not found !");
                return res.status(401).json({error: "User not found!"});
        }
        console.log("User found : ", user);

        let match = await bcrypt.compare(password, user.password)
        if(!match){
            console.log("Invalid password !");
            return res.status(401).json({error: "Invalid password !"});
        }

                    let payload = {
            user_id: user._id,
            email: user.email,
            role: user.role
        }

        if(user.verified.email == false){
            console.log("User not verified. Please verify and try again");
            return res.status(400).json({success: false, message : "User not verified. Please verify and try again"});
        }

        const jwtToken = generateToken(payload);
        user.jwtToken = jwtToken;
        await user.save();

        console.log("User login successfull", user);
        return res.status(200).json({success: true, message: "User login successfull", data: user});

    } catch (error) {
          console.log(error);
        res.status(500).json({error})
    }
}

const verifyJwtToken = async(req,res) => {
    try {
        let JWTToken = req.headers["auth-token"];
        if(!JWTToken){
            console.log("JWT Token is missing");
            return res.status(401).json({error: "JWT Token is missing"});
        }

        let decoded = jwt.verify(JWTToken, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.payload.user_id)
        if(!user){
                console.log("User not found !");
                return res.status(401).json({error: "User not found!"});
        }
        if(user.jwtToken != JWTToken){
            console.log("Invalid Token !");
            return res.status(401).json({message: "Invalid Token !"})
        }
        
        console.log("decoded: ", decoded);
        return res.status(200).json({decoded});
    } catch (error) {
                  console.log(error);
        res.status(500).json({error})
    }
}

const logoutUser = async(req,res) => {
    try {
        const user = req.user;
        // console.log("req dot user : ", user);

        user.jwtToken = null;
        await user.save();

        console.log("User logged out successfully");
        return res.status(200).json({success: true, message: "User logged out successfully", data: user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

const currentUser = async (req,res) => {
    try {

        const user = req.user
        if(!user){
                console.log("User not found !");
                return res.status(401).json({error: "User not found!"});
            }

            const {password, jwtToken, ...userData} = user.toObject()
            return res.status(200).json({success: true, user: userData});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

const passwordResetRequest = async(req,res) => {
    try {
        const {email} = req.body;

        const user = await userModel.findOne({email});
        if(!user){
            console.log("User not found !");
            return res.status(401).json({error: "User not found!"});
        }
        const passwordToken = token();
        
        user.passwordToken.email = passwordToken;
        user.passwordTokenVerified.email = false;
        await user.save();

        sendEmail({
      to: user.email,
      subject: "Password Reset",
      body: `
        Click here to reset password:
        <a href="http://localhost:6040/api/auth/verify/passwordRequest/${passwordToken}">
          Reset Password
        </a>
      `
    });

    console.log("Password reset link sent to email");
    return res.status(200).json({
        message: "Password reset link sent to email"
    });
        }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const passwordVerify = async(req,res) => {
    try {
        let {token} = req.params
        const user = await userModel.findOne({'passwordToken.email': token})

         if(!user){
            console.log("Invalid token ! ");
            return res.status(401).json({error: "Invalid token ! "});
        }

        user.passwordTokenVerified.email = true;
        await user.save();
        res.status(200).send(`<h1>Password reset Verified successfully ✅!</h1>`)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


const passwordReset = async(req,res) => {
    try {
        const {userId, newPassword} = req.body;

        // const user = await userModel.findById(userId);
        const user = req.user;

         if(!user){
            console.log("User not found !");
            return res.status(401).json({error: "User not found!"});
        }

        if (!user.passwordTokenVerified.email) {
            return res.status(403).json({ error: "Password reset not verified" });
    }

        const saltRounds = Number(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        
        user.password = hashedPassword;
        user.passwordToken.email = null;
        user.passwordTokenVerified.email = false;

        await user.save();
        console.log("Password reset successful");
        res.status(200).json({success: true, message: "Password reset successful", data: user});

       
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


const customerProfile = async(req,res) => {
    try {
        const user = req.user;
        const {address, firstName, lastName, phone, dateOfBirth} = req.body;

        const customer = await customerModel.findOne({userId: user._id});

        if(!customer){
            console.log("Customer not found !");
            return res.status(401).json({error: "Customer not found!"});
        }

        
        if (address) customer.address = address;
        
        await customer.save();
        console.log("Profile Details saved ! ");
        return res.status(200).json({success: true, message: "Profile Details saved ! ", data: customer})
        } 
        catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}

const getCustomerDetails = async(req,res) => {
    try {
        let customerId = req.params.id;

        const customer = await customerModel.findById(customerId);
        if(!customer){
             console.log("Customer not found !");
            return res.status(401).json({error: "Customer not found!"});
        }

        console.log("Customer Details : ", customer);
        return res.status(200).json({success: true, message: "Customer Details : ", data: customer});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


const updateCustomerDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;

    const customer = await customerModel.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found!" });
    }


    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (phone) customer.phone = phone;
    if (dateOfBirth) customer.dateOfBirth = dateOfBirth;

//    if (address) {
//   if (address.street) customer.address[0].street = address.street;  
//   if (address.city) customer.address[0].city = address.city;
//   if (address.state) customer.address[0].state = address.state;
//   if (address.pinCode) customer.address[0].pinCode = address.pinCode;
// }
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
    return res.status(500).json({ error: error.message });
  }
}


export {registerCustomer, verifyEmail, loginUser, verifyJwtToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset, 
    customerProfile, getCustomerDetails, updateCustomerDetails}