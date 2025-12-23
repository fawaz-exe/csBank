import {body, validationResult} from 'express-validator'

export const registerMiddleware = [
    body("email", "Email required to register").notEmpty().isEmail(),
    body("password", "Password required to register").notEmpty(),
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
            return res.status(400).json({errors: myerrors})
        }
        next();
    }
]

export default registerMiddleware