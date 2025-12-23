import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "teller", "admin"],
      required: true,
    },
//if the user is active or not
    isActive: {
      type: Boolean,
      required: true,
    },
//store verification token
    verifyToken: {
      email: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
    },
//after verification, the value cahnges to true
    verified: {
    email: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Boolean,
      default: false,
    },
  },
//store jwt token
  jwtToken: {
    type: String
  },
//store password verified token
  passwordToken: {
    email: {
      type: String,
      default: null,
    }
  },
//After verficationis done, the value changes to true
  passwordTokenVerified: {
    email: {
      type: Boolean,
      default: false,
    }
  },
//the most recent login date
  lastLogin: {
    type: Date,
    required: true,
  },

//login history o fthe user in an array. entire history
    loginHistory: [
      {
        timestamp: { type: Date },
        ipAddress: { type: String },
        status: {
          type: String,
          enum: ["success", "failed"],
        },
      },
    ],
    createdAt:{
        type: Date,
        required: true
    },
    updatedAt:{
        type: Date,
        required: true
    }
  },
//   { Timestamp: true }//this is giving us createdAt and updatedAt data;
); 

const User = mongoose.model("User", userSchema);

export default User;
