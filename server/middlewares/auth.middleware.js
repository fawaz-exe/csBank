import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

import dotenv from "dotenv";
dotenv.config();

async function authMiddleware(req, res, next) {
  try {
    console.log("Headers received:", req.headers);
    let JToken = req.headers["auth-token"];
    console.log("JWT token received: ", JToken);

    if (!JToken) {
      console.log("JWT Token is missing");
      return res
        .status(403)
        .json({ success: false, message: "JWT Token is missing" });
    }

    let decoded = jwt.verify(JToken, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.payload.user_id);
    if (!user) {
      console.log("User not found !");
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    }
    if (user.jwtToken != JToken) {
      console.log("Invalid Token !");
      return res
        .status(403)
        .json({ success: false, message: "Invalid Token !" });
    }

    console.log(decoded);

    req.user = user; //
    req.token = JToken; //
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Auth Token Expired or Invalid !" });
  }
}

export default authMiddleware;
