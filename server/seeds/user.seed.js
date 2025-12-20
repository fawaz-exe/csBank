import mongoose from "mongoose";
// import "../dbConnect.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const DB_CONNECT = process.env.MONGODB_COMPASS;
// console.log("mongodb = ", DB_CONNECT);
const seedPassword = process.env.SEED_PASSWORD;
// const dbName = 'csBank'

async function seedUser() {
  try {
      await mongoose.connect(DB_CONNECT);
      console.log("connected to MongoDB");
      // const NOW = new Date()
      
      const saltRounds = Number(process.env.SALTROUNDS);
      const hashedPassword = await bcrypt.hash(seedPassword, saltRounds);
      
      await User.deleteMany({})
    const users = [
      {
        email: "admin@csbank.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "127.0.0.1",
            status: "success",
          },
        ],
      },
      {
        email: "teller1@csbank.com",
        password: hashedPassword,
        role: "teller",
        isActive: true,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "192.168.1.10",
            status: "success",
          },
        ],
      },
      {
        email: "teller2@csbank.com",
        password: hashedPassword,
        role: "teller",
        isActive: false,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "192.168.1.11",
            status: "failed",
          },
        ],
      },
      {
        email: "customer1@gmail.com",
        password: hashedPassword,
        role: "customer",
        isActive: true,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "127.0.0.1",
            status: "success",
          },
        ],
      },
      {
        email: "customer2@gmail.com",
        password: hashedPassword,
        role: "customer",
        isActive: true,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "127.0.0.1",
            status: "success",
          },
        ],
      },
      {
        email: "customer3@gmail.com",
        password: hashedPassword,
        role: "customer",
        isActive: false,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "127.0.0.1",
            status: "success",
          },
        ],
      },
      {
        email: "customer4@gmail.com",
        password: hashedPassword,
        role: "customer",
        isActive: true,
        lastLogin: new Date(),
        loginHistory: [
          {
            timestamp: new Date(),
            ipAddress: "127.0.0.1",
            status: "success",
          },
        ],
      },
    ];

    await User.create(users);

    console.log("User Saved", users);
  } catch (error) {
    console.log("Seeding failed", error);
  }
}

seedUser();
