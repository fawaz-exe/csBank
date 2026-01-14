import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';

import dotenv from 'dotenv'
dotenv.config();

export default function tellerOnly(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthenticated request"
            });
        }

        if (req.user.role !== "teller") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Teller only."
            });
        }

        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Teller account is inactive"
            });
        }

        next();
    } catch (error) {
        console.error("tellerOnly middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}