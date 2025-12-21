import {body, validationResult} from 'express-validator'

export const newPasswordMiddleware = [
    body("userId", "Please enter a valid userId").notEmpty(),
    body('newpassword', "Password must have 8 characters, 1 Lowercase, 1 Uppercase, 1 Number, 1 Symbol").notEmpty().isStrongPassword({
        minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 }),
        
        (req,res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const myerrors = errors.array().map(err => ({
                    msg: err.msg,
                    field : err.path,
                    location : err.location

                }));
                return res.status(400).json({errors : myerrors})
            }
            next();
        }
]