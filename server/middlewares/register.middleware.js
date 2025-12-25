import {body, validationResult} from 'express-validator'

export const registerMiddleware = [
    body("email", "Email required to register").notEmpty().isEmail(),
    body('password', "Password must have 8 characters, 1 Lowercase, 1 Uppercase, 1 Number, 1 Symbol").notEmpty().isStrongPassword({
            minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1 }),
    body("firstName", "firstName required to register").notEmpty(),
    body("lastName", "lastName required to register").notEmpty(),
    body("phone", "phone required to register").notEmpty().isMobilePhone(),
    body("dateOfBirth", "dateOfBirth required to register").notEmpty(),

    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const myerrors = errors.array().map(err => ({
                msg: err.msg,
                field: err.path,
                location: err.location
            }));
            return res.status(400).json({success: false, message: myerrors})
        }
        next();
    }
]

export default registerMiddleware