import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Teller from "../models/teller.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const deleteUserByAdmin = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;

        if (req.user._id.toString() === userIdToDelete) {
            return res.status(400).json({
                success: false,
                message: "coconuts not found"
            });
        }

        const user = await User.findById(userIdToDelete);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role == "customer") {
            await Customer.deleteOne({ userId: user._id });
        }

        if (user.role == "teller") {
            await Teller.deleteOne({ userId: user._id });
        }

        if (user.role == "admin") {
            await Admin.deleteOne({ userId: user._id });
        }

        await User.deleteOne({ _id: user._id });

        return res.status(200).json({
            success: true,
            message: "User and its data deleted permanently",
            data: {
                userId: userIdToDelete,
                role: user.role
            }
        });

    } catch (error) {
        console.error("deleteUserByAdmin error:", error);

        if (error.name == "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const manageIpPolicy = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }
        const { ipAddress, allowedRoles, blockedRoles, maxUsers, isTrusted, description } = req.body;

        if (!ipAddress) {
            return res.status(400).json({
                success: false,
                message: "IP address is required"
            });
        }

        const admin = await Admin.findOne({ userId: req.user._id });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found"
            });
        }

        // if policy already exists
        const existingPolicy = admin.ipPolicies.find(
            p => p.ipAddress == ipAddress
        );

        if (existingPolicy) {
            // updating existing policy
            existingPolicy.allowedRoles = allowedRoles ?? existingPolicy.allowedRoles;
            existingPolicy.blockedRoles = blockedRoles ?? existingPolicy.blockedRoles;
            existingPolicy.maxUsers = maxUsers ?? existingPolicy.maxUsers;
            existingPolicy.isTrusted = isTrusted ?? existingPolicy.isTrusted;
            existingPolicy.description = description ?? existingPolicy.description;
            existingPolicy.isActive = true;
        } else {
            // adding new policy
            admin.ipPolicies.push({
                ipAddress,
                allowedRoles,
                blockedRoles,
                maxUsers,
                isTrusted,
                description,
            });
        }

        admin.updatedAt = new Date();
        await admin.save();

        return res.status(201).json({
            success: true,
            message: "IP policy saved successfully",
            data: admin.ipPolicies
        });

    } catch (error) {
        console.error("manageIpPolicy error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const createUserByAdmin = async (req, res) => {
    try {
        const { email, phone, password, role, firstName, lastName, employeeId, dateOfBirth } = req.body;


        if (!email || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "email, phone, password and role are required"
            });
        }

        if (!["customer", "teller", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }


        const saltRounds = Number(process.env.SALTROUNDS || 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const user = await User.create({
            email,
            phone,
            password: hashedPassword,
            role,
            isActive: true,
            verified: {
                email: true,
                phone: true,
            },
            profileCompleted: role == "customer" ? false : true,
            hasAccount: false,
            createdAt: new Date(),
        });


        let profile = null;
        if (role == "customer") {
            if (!firstName || !dateOfBirth) {
                return res.status(400).json({
                    success: false,
                    message: "firstName and dateOfBirth are required for customer"
                });
            }

            profile = await Customer.create({
                userId: user._id,
                firstName,
                lastName: lastName || "",
                dateOfBirth,
                status: "pending",
                customerSince: new Date(),
                createdAt: new Date(),
            });
        }

        if (role == "teller") {
            if (!firstName || !employeeId) {
                return res.status(400).json({
                    success: false,
                    message: "firstName and employeeId are required for teller"
                });
            }

            profile = await Teller.create({
                userId: user._id,
                firstName,
                lastName: lastName || "",
                employeeId,
                status: "active",
                createdAt: new Date(),
            });
        }

        if (role == "admin") {
            if (!firstName || !employeeId) {
                return res.status(400).json({
                    success: false,
                    message: "firstName and employeeId are required for admin"
                });
            }

            profile = await Admin.create({
                userId: user._id,
                firstName,
                lastName: lastName || "",
                employeeId,
                status: "active",
                createdAt: new Date(),
            });
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                userId: user._id,
                role: user.role,
                profileId: profile?._id,
                user, profile
            }
        });

    } catch (error) {
        console.error("createUserByAdmin error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getLoginLogs = async (req, res) => {
    try {
        // const users = await User.find(
        //     {},
        //     {
        //         email: 1,
        //         role: 1,
        //         loginHistory: 1,
        //         _id: 0
        //     }
        // );

        // return res.status(200).json({
        //     success: true,
        //     message: "Login logs fetched successfully",
        //     data: users
        // });

                const logs = await User.aggregate([
            { $unwind: "$loginHistory" },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    email: "$email",
                    role: "$role",
                    ipAddress: "$loginHistory.ipAddress",
                    timestamp: "$loginHistory.timestamp",
                    status: "$loginHistory.status",
                },
            },
            { $sort: { timestamp: -1 } } // latest first
        ]);

        return res.status(200).json({
            success: true,
            message: "Login logs fetched successfully",
            total: logs.length,
            data: logs
        });

    } catch (error) {
        console.error("getLoginLogs error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};