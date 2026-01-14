import mongoose from "mongoose";
import User from "../models/user.model.js";
import Teller from "../models/teller.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGODB_COMPASS;


async function seedTeller() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        const tellerData = {
            email: "teller@csbank.com",
            phone: "+919999999999",
            password: "Teller@123",
            firstName: "Teller",
            employeeId: "EMP-1001",
        };

        const existingUser = await User.findOne({ email: tellerData.email });
        if (existingUser) {
            console.log("Teller user already exists. Skipping seeding.");
            process.exit(0);
        }

        const saltRounds = Number(process.env.SALTROUNDS || 10);
        const hashedPassword = await bcrypt.hash(
            tellerData.password,
            saltRounds
        );

        const user = await User.create({
            email: tellerData.email,
            phone: tellerData.phone,
            password: hashedPassword,
            role: "teller",
            isActive: true,
            verified: {
                email: true,
                phone: true,
            },
            profileCompleted: true,
            hasAccount: false,
            createdAt: new Date(),
        });

        console.log("Teller USER created:", user._id);


        const teller = await Teller.create({
            userId: user._id,
            firstName: tellerData.firstName,
            lastName: tellerData.lastName,
            employeeId: tellerData.employeeId,
            status: "active",
            approvedCustomers: [],
            createdAt: new Date(),
        });

        console.log("Teller PROFILE created:", teller._id);

        console.log("✅ Teller seeding completed successfully");
        process.exit(0);

    } catch (error) {
        console.error("❌ Teller seeding failed:", error);
        process.exit(1);
    }
}

seedTeller();
