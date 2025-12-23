import Account from '../models/account.model.js'

const getAccountById = async (req, res)=>{
     try {
        const accountExists = await Account.findById(req.params.id);

        if (!accountExists) return res.status(404).json({ error: "Account not found" });

        res.status(200).json(accountExists);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error" });
    }
}


