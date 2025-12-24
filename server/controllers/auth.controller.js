import User from "../models/user.model.js";
import Customer from "../models/customer.model.js"
import token from "../utils/token.utils.js";
import { generateToken } from "../utils/jwt.utils.js";
import sendEmail from "../workers/send.email.js";
import bcrypt from "bcrypt"

import dotenv from 'dotenv'
dotenv.config();

const seedPassword = process.env.SEED_PASSWORD;


const registerCustomer = async(req,res) => {
    try {
        const {email, password, firstName, lastName, dateOfBirth, phone, address} = req.body;
        
        const existingUser = await User.findOne({email: req.body.email});
        
        if(existingUser){
            console.log({success: false, message: "User already exists", data: existingUser});
            return res.status(409).json({success: false, message: "User already exists", data: existingUser});
            }   

            const saltRounds = Number(process.env.SALTROUNDS);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            let emailtoken = token();
            let phonetoken = token();
            let clientIp = req.socket.remoteAddress;
            
            const user = await User.create({
                email: email, password : hashedPassword, role : "customer", isActive : true, 
                lastLogin: new Date(),
                verifyToken : {
                    email : emailtoken,
                    phone: phonetoken
                },
                createdAt: new Date(),
                loginHistory: [
                    {
                        timestamp: new Date(),
                        ipAddress: clientIp,
                        status: "success",
                    },
                            ],
            })

            const existingCustomer = await Customer.findOne({userId: user._id});

            if(existingCustomer){
                console.log({success: false, message: "Customer already exists for this user", data: existingCustomer});
                return res.status(409).json({success: false, message: "Customer already exists for this user", data: existingCustomer});
                }

            console.log(user._id);
            

             const customer = await Customer.create({
                firstName, lastName, dateOfBirth, phone: phone, address,
                customerSince: new Date(),
                createdAt: new Date(),
                userId : user._id.toString()
            });


        sendEmail({
            to: user.email,
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
        }
        catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}


const verifyEmail = async(req,res) => {
    try {
        let token = req.params.token;
        const user = await User.findOne({'verifyToken.email': token})
        user.verified.email = true
        await user.save();
        console.log("Email is verified successfully ");
        res.status(200).json({success:true, message: "Email is verified successfully !"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}


const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user){
                console.log("User not found !");
                return res.status(401).json({success: false, message: "User not found!"});
        }
        console.log("User found : ", user);

        let match = await bcrypt.compare(password, user.password)
        if(!match){
            console.log("Invalid password !");
            return res.status(401).json({success: false, message: "Invalid password !"});
        }

        let payload = {
            user_id: user._id,
            email: user.email,
            role: user.role
        }

        if(user.verified.email == false){
            console.log("Email not verified. Please verify and try again");
            return res.status(400).json({success: false, message : "Email not verified. Please verify and try again"});
        }

        const jwtToken = generateToken(payload);
        user.jwtToken = jwtToken;
        await user.save();

        console.log("User login successfull", user);
        return res.status(200).json({success: true, message: "User login successfull", data: user});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}

const verifyJwtToken = async(req,res) => {
    try {
        let JWTToken = req.headers["auth-token"];
        if(!JWTToken){
            console.log("JWT Token is missing");
            return res.status(401).json({success: false, message: "JWT Token is missing"});
        }

        let decoded = jwt.verify(JWTToken, process.env.JWT_SECRET);

        const user = await User.findById(decoded.payload.user_id)
        if(!user){
                console.log("User not found !");
                return res.status(401).json({success: false, message: "User not found!"});
        }
        if(user.jwtToken != JWTToken){
            console.log("Invalid Token !");
            return res.status(401).json({success: false, message: "Invalid Token !"})
        }
        
        console.log("decoded: ", decoded);
        return res.status(200).json({success: true, message : "decoded , payload is fetched", data: decoded});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
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
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}

const currentUser = async (req,res) => {
    try {

        const user = req.user
        if(!user){
                console.log("User not found !");
                return res.status(401).json({success: false, message: "User not found!"});
            }

            const {password, jwtToken, ...userData} = user.toObject()
            return res.status(200).json({success: true, message: "Fetched current User Details", user: userData});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}

const passwordResetRequest = async(req,res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            console.log("User not found !");
            return res.status(401).json({success: false, message: "User not found!"});
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
        <a href="http://localhost:6040/api/auth/verify/password/${passwordToken}">
          Reset Password
        </a>
      `
    });

    console.log("Password reset link sent to email");
    return res.status(200).json({success : true,
        message: "Password reset link sent to email"
    });
        }
    catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}

const passwordVerify = async(req,res) => {
    try {
        let {token} = req.params
        const user = await User.findOne({'passwordToken.email': token})

         if(!user){
            console.log("Invalid token ! ");
            return res.status(401).json({success: false, message: "Invalid token ! "});
        }

        user.passwordTokenVerified.email = true;
        await user.save();
        console.log("Password reset Verified successfully ✅");
        return res.status(200).json({success: true, message: "Password reset Verified successfully !"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}


const passwordReset = async(req,res) => {
    try {
        const {userId, newPassword} = req.body;

        // const user = await User.findById(userId);
        const user = req.user;

         if(!user){
            console.log("User not found !");
            return res.status(401).json({success: false, message: "User not found!"});
        }

        if (!user.passwordTokenVerified.email) {
            return res.status(403).json({ success: false, message: "Password reset not verified" });
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
        res.status(500).json({success: false, message: error.message, data : "Internal server error"})
    }
}





export {registerCustomer, verifyEmail, loginUser, verifyJwtToken, logoutUser, currentUser, passwordResetRequest, passwordVerify, passwordReset}