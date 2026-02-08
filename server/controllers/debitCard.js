import Customer from "../models/customer.model.js";

const getDebitCardDetails = async (req, res) => {
    try {
        // const user = req.user;
        const userid = req.user._id
        console.log(userid)
        const customer = await Customer.findOne({ "userId" : userid });
        if (!customer) {
            console.log("Customer not found!")
            return res.status(404).json({ success: false, message: "Customer not found!" });
        }
        let Name = customer.firstName +  " " + customer.lastName
        return res.status(200).json({success: true, debitCards : customer.debitCard, Name})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, error: error.message, data : "Internal server error"})
    }
}

export default getDebitCardDetails