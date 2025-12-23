import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

  address: [
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
  ],

  status:
    {
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

  debitCard: [{
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
      type: Boolean,
      required: true,
    },
    dailyLimit: {
      type: Number,
      default: 50000,
    },
  }],
});

const customerModel = mongoose.model("Customer", customerSchema);
export default customerModel;
