import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET

const generateToken = (payload) => {
    return jwt.sign({payload}, SECRET_KEY, {expiresIn: "30min"})
}

export {generateToken}