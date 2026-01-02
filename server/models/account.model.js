import mongoose, { mongo } from "mongoose";

const accountSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    //Account number will be auto generated 
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    //user gets to select from either of account type
    accountType: {
      type: String,
      enum: ["savings", "current"],
      required: true,
    },
    //This sets initial minimum balance
    balance: {
      type: Number,
      default: 0,
    },
    //The limit is per day
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

    //Once the account is activated, it changes from pending to active
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },

    transactionHistory: [
      {
        type: {
          type: String,
          enum: ["DEBIT", "CREDIT"],
          required: true,
        },

        amount: {
          type: Number,
          required: true,
        },

        discription: {
          type: String,
        },

        accountDetails: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  //   { Timestamp: true }//this is giving us createdAt and updatedAt data;
);

const Account = mongoose.model("Account", accountSchema);
export default Account;