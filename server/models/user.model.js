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

    isActive: {
      type: Boolean,
      required: true,
    },

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

  jwtToken: {
    type: String
  },

  passwordToken: {
    email: {
      type: String,
      default: null,
    }
  },

  passwordTokenVerified: {
    email: {
      type: Boolean,
      default: false,
    }
  },

  lastLogin: {
    type: Date,
    required: true,
  },

    lastLogin: {
      type: Date,
      required: true,
    },

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
