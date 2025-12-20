import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "teller", "admin"],
        default: "user"
    },
    lastLogin:{
        type: Date
    },
    loginHistory:{

    },
    ipAddress:{
        type: String
    },
    status:{
        type: String,
        enum : ["ACTIVE", "FROZEN"],
        default: "ACTIVE",
    }
})

const userModel = mongoose.model('User', userSchema)

export default userModel