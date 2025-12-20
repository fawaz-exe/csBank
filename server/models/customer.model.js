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
  address: {
    steet: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["ACTIVE", "FROZEN"],
    default: "ACTIVE",
  },
  customerSince:{
    type: Date
  },
  alerts:{
    type: String
  }
});

const customerModel = mongoose.model("Customer", customerSchema);
