import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

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

    employeeId: {
        type: String,
        required: true,
        unique: true,
    },

    permissions: {
        manageUsers: {
            type: Boolean,
            default: true,
        },
        manageTellers: {
            type: Boolean,
            default: true,
        },
        manageCustomers: {
            type: Boolean,
            default: true,
        },
    },

    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active",
    },

    // ip policy Schema
    ipPolicies: [
        {
            ipAddress: {
                type: String,
                required: true,
            },

            allowedRoles: {
                type: [String],
                enum: ["admin", "teller", "customer"],
                default: ["customer"],
            },

            blockedRoles: {
                type: [String],
                enum: ["admin", "teller", "customer"],
                default: [],
            },

            maxUsers: {
                type: Number,
                default: 5,
            },

            isTrusted: {
                type: Boolean,
                default: false,
            },

            description: {
                type: String,
            },

            isActive: {
                type: Boolean,
                default: true,
            },

            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],

    lastActionAt: {
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
}
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;