import User from "../models/user.model.js";
import Customer from "../models/customer.model.js"
import Teller from "../models/teller.model.js"
import Account from "../models/account.model.js";
import bcrypt from "bcrypt"



export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({})
            .populate("userId", "email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All customers fetched successfully",
            data: customers
        });

    } catch (error) {
        console.error("getAllCustomers error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
};

export const getCustomerById = async (req, res) => {

    console.log('getCustomerById-----');
    try {
        const customerId = req.params.id;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                message: "Customer ID is required"
            });
        }



        const customer = await Customer.findById(customerId)
            .populate("userId", "email phone role isActive verified profileCompleted");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer fetched successfully",
            data: customer
        });

    } catch (error) {
        console.error("getCustomerById controller error:", error);

        if (error.name == "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
                data: error
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
};




export const lockCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (customer.status == "suspended") {
            return res.status(409).json({
                success: false,
                message: "Customer is already locked"
            });
        }

        customer.status = "suspended";
        customer.updatedAt = new Date();
        await customer.save();

        // update teller activity
        await Teller.findOneAndUpdate(
            { userId: req.user._id },
            { lastActionAt: new Date() }
        );

        return res.status(200).json({
            success: true,
            message: "Customer account locked successfully",
            data: customer
        });

    } catch (error) {
        console.error("lockCustomer error:", error);

        if (error.name == "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
                data: error
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
};


export const unlockCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (customer.status == "active") {
            return res.status(409).json({
                success: false,
                message: "Customer account is already active"
            });
        }

        customer.status = "active";
        customer.customerSince = customer.customerSince || new Date();
        customer.updatedAt = new Date();
        await customer.save();

        // update teller activity
        await Teller.findOneAndUpdate(
            { userId: req.user._id },
            { lastActionAt: new Date() }
        );

        return res.status(200).json({
            success: true,
            message: "Customer account unlocked successfully",
            data: customer
        });

    } catch (error) {
        console.error("unlockCustomer error:", error);

        if (error.name == "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
                data: error
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
};


export const resetCustomerPassword = async (req, res) => {
    try {
        const customerId = req.params.id;
        const password = req.body.password;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const user = await User.findById(customer.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Linked user not found"
            });
        }

        const saltRounds = Number(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password = hashedPassword;
        user.passwordToken = { email: null };
        user.passwordTokenVerified = { email: false };
        user.jwtToken = null; // force re-login
        user.updatedAt = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Customer password reset successfully."
        });

    } catch (error) {
        console.error("resetCustomerPassword error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
                data: error
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: error
        });
    }
};


export const tellerDashboardStats = async (req, res) => {
    try {

        const totalCustomers = await Customer.countDocuments();

        const pendingCustomers = await Customer.countDocuments({
            status: "pending"
        });

        const activeCustomers = await Customer.countDocuments({
            status: "active"
        });

        const suspendedCustomers = await Customer.countDocuments({
            status: "suspended"
        });



        const teller = await Teller.findOne({ userId: req.user._id })
            .select("firstName lastName employeeId lastActionAt status");

        return res.status(200).json({
            success: true,
            message: "Teller dashboard stats fetched successfully",
            data: {
                teller: teller || null,
                stats: {
                    totalCustomers,
                    pendingCustomers,
                    activeCustomers,
                    suspendedCustomers,
                }
            }
        });

    } catch (error) {
        console.error("tellerDashboardStats error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
