import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
//user id is taken from the reference of user from the userSchema     
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  address: 
    {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pinCode: {
        type: String,
      },
    },

//Status of customer will change from pending to active once the teller approves the customer account
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },

    customerSince: {
      type: Date,
    },

    alerts: [
      {
        type: {
          type: String,
          enum: ["low_balance", "large_transaction", "security"],
        },
        message: String,
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
//This is will be added once the customer makes an account and then applies for debit card
    debitCard: [
      {
        type: String,
        cardNumber: {
          type: String,
          required: true,
          unique: true,
        },
        expiryDate: {
          type: Date,
          required: true,
        },
        cvv: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean
        },
        dailyLimit: {
          type: Number,
          default: 50000,
        },
      },
    ],
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
  },
//   { Timestamp: true }//this is giving us createdAt and updatedAt data;
); 

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;