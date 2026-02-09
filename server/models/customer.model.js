import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
    },

    // Status of customer will change from pending to active once approved
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },

    customerSince: {
      type: Date,
    },

    // Customer alerts
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

    // Debit card details (added after account approval)
    debitCard: [
      {
        cardNumber: {
          type: String,
          required: true,
          unique: true,
        },
        expiryDate: {
          type: Date,
          // required: true,
        },
        cvv: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        dailyLimit: {
          type: Number,
          default: 50000,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
