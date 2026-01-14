import mongoose from "mongoose";

const tellerSchema = mongoose.Schema({
    // Reference to User (auth layer)
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

    // branch: {
    //     branchId: {
    //         type: String,
    //         required: true,
    //     },
    //     branchName: {
    //         type: String,
    //         required: true,
    //     },
    //     city: {
    //         type: String,
    //     },
    // },

    // account status
    status: {
        type: String,
        enum: ["active", "pending", "suspended", "closed"],
        default: "active",
    },

    // Track customers approved by this teller
    approvedCustomers: [
        {
            customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
            },
            approvedAt: {
                type: Date,
                default: Date.now,
            },
        },
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

const Teller = mongoose.model("Teller", tellerSchema);

export default Teller;
