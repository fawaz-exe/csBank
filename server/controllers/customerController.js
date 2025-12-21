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

        // sendEmail({
        //     to: existingUser.email,
        //     subject : 'Email Confirmation',
        //     body: `
        //     Hello ${req.body.firstname}<br>
        //     Please click this <a href = "http://localhost:6040/api/auth/verify/email/${emailtoken}">Click Me</a>
        //     <br>
        //     Thankyou :)
        //     `
        // });


        console.log("Customer Registered successfully. Email Verification required !");
        return res.status(201).json({
        message: "Customer Registered successfully. Email Verification required !", customer
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
        user.verified.email = 'true'
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
            return res.status(400).json({message : "User not verified. Please verify and try again"});
        }

        const jwtToken = generateToken(payload);
        user.jwtToken = jwtToken;
        await user.save();

        console.log("User login successfull", user);
        return res.status(200).json({message: "User login successfull", user});

    } catch (error) {
          console.log(error);
        res.status(500).json({error})
    }
}

const verifyJWTToken = async(req,res) => {
    try {
        let JToken = req.headers["auth-token"];
        if(!JToken){
            console.log("JWT Token is missing");
            return res.status(401).json({error: "JWT Token is missing"});
        }

        let decoded = jwt.verify(JToken, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.payload.user_id)
        if(!user){
                console.log("User not found !");
                return res.status(401).json({error: "User not found!"});
        }
        if(user.jwtToken != JToken){
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

        user.jwtToken = null;
        await user.save();

        console.log("User logged out successfully");
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

const currentUser = async (req,res) => {
    try {

        // let decoded = jwt.verify(JToken, process.env.JWT_SECRET);
        const user = req.user
        if(!user){
                console.log("User not found !");
                return res.status(401).json({error: "User not found!"});
            }

            const {password, jwtToken, ...userData} = user.toObject()
            return res.status(200).json({user: userData});
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
        user.pverified.email = false;
        await user.save();

        // sendEmail({
    //   to: user.email,
    //   subject: "Password Reset",
    //   body: `
    //     Click here to reset password:
    //     <a href="http://localhost:6040/api/auth/verify/passwordRequest/${passwordToken}">
    //       Reset Password
    //     </a>
    //   `
    // });

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
            console.log("User not found !");
            return res.status(401).json({error: "User not found!"});
        }

        user.pverified.email = true;
        await user.save();
        res.status(200).send(`<h1>Password reset Verified successfully ✅!</h1>`)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


const passwordReset = async(req,res) => {
    try {
        const {userId, newpassword} = req.body;

        const user = await userModel.findById(userId);

         if(!user){
            console.log("User not found !");
            return res.status(401).json({error: "User not found!"});
        }

        if (!user.pverified.email) {
            return res.status(403).json({ error: "Password reset not verified" });
    }

        const saltRounds = Number(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds)
        
        user.password = hashedPassword;
        user.passwordToken.email = null;
        user.pverified.email = false;

        await user.save();
        console.log("Password reset successful");
        res.status(200).json({ message: "Password reset successful" });

       
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}


export {registerCustomer, verifyEmail, loginUser, verifyJWTToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset}