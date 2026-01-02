import mongoose from "mongoose";
import dotenv from "dotenv";
import Account from "../models/account.model.js";
import Customer from "../models/customer.model.js";

dotenv.config({ path: "../.env" });

console.log("MONGODB_URI =", process.env.MONGODB_COMPASS);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_COMPASS);
  console.log("MongoDB connected");
};

const seedAccounts = async () => {
  try {
    await connectDB();

    const customers = await Customer.find().limit(3);

    if (customers.length < 3) {
      console.log("Not enough customers found. Seed customers first.");
      process.exit(1);
    }

    await Account.deleteMany();
    console.log("Existing accounts removed");

    const accounts = [
      {
        customerId: customers[0]._id,
        accountNumber: "ACC1001",
        accountType: "savings",
        balance: 50000,
        status: "active",
        transferLimit: 20000,
        dailyTransferLimit: 50000,
        transactions: [],
      },
      {
        customerId: customers[1]._id,
        accountNumber: "ACC1002",
        accountType: "savings",
        balance: 30000,
        status: "active",
        transferLimit: 15000,
        dailyTransferLimit: 40000,
        transactions: [],
      },
      {
        customerId: customers[2]._id,
        accountNumber: "ACC1003",
        accountType: "current",
        balance: 100000,
        status: "active",
        transferLimit: 50000,
        dailyTransferLimit: 100000,
        transactions: [],
      },
    ];

    await Account.insertMany(accounts);

    console.log("Accounts seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("Account seeding failed:", error.message);
    process.exit(1);
  }
};

seedAccounts();
