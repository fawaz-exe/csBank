import mongoose, { mongo } from "mongoose";

const accountSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["savings", "current"],
      required: true,
    },

    balance: {
      type: Number,
      min: 1000, //This sets initial minimum balance
      default: 1000,
    },

    transferLimit: {
      type: Number,
      min: 1,
      default: 50000,
    },

    withdrawalLimit: {
      type: Number,
      default: 100000,
    },

    depositLimit: {
      type: Number,
      default: 100000,
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },
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

const Account = mongoose.model("Account", accountSchema);
export default Account;
