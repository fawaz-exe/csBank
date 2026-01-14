import mongoose from "mongoose";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGODB_COMPASS;

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        const adminData = {
            email: "admin@csbank.com",
            phone: "+919888888888",
            password: "Admin@123",
            firstName: "Admin",
            employeeId: "ADMIN-1001",
        };

        // Check if admin user already exists
        const existingUser = await User.findOne({ email: adminData.email });
        if (existingUser) {
            console.log("Admin user already exists. Skipping seeding.");
            process.exit(0);
        }

        // Hash password
        const saltRounds = Number(process.env.SALTROUNDS || 10);
        const hashedPassword = await bcrypt.hash(
            adminData.password,
            saltRounds
        );

        // Create USER
        const user = await User.create({
            email: adminData.email,
            phone: adminData.phone,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            verified: {
                email: true,
                phone: true,
            },
            profileCompleted: true,
            hasAccount: false,
            createdAt: new Date(),
        });

        console.log("ADMIN USER created:", user._id);

        // Create ADMIN
        const admin = await Admin.create({
            userId: user._id,
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            employeeId: adminData.employeeId,
            status: "active",
            permissions: {
                manageUsers: true,
                manageTellers: true,
                manageCustomers: true,
            },
            createdAt: new Date(),
        });

        console.log("ADMIN PROFILE created:", admin._id);

        console.log("Admin seeding completed successfully✅");
        process.exit(0);

    } catch (error) {
        console.error("Admin seeding failed❌:");
        console.error(error);
        process.exit(1);
    }
}

seedAdmin();
