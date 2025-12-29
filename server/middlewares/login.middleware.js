import {body, validationResult} from 'express-validator'

export const loginMiddleware = [
    body("email", "Email required to login").notEmpty().isEmail(),
    body("password", "Password required to login").notEmpty(),

    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const myerrors = errors.array().map(err => ({
                msg: err.msg,
                field: err.path,
                location: err.location
            }));
            return res.status(400).json({success : false, message: myerrors})
        }
        next();
    }
]