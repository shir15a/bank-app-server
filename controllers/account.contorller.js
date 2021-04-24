const accountModel = require("../models/account.model");

// Create new account
const createAccount = (req, res) => {
    const {
        israeliId,
        name,
        email,
    } = req.body;

    const user = new accountModel({
        israeliId,
        name,
        email,
    });

    console.log(user, 'user');
    user.save((err) => {
        if (err) return res.status(400).json({ error: err });
        return res.status(201).json({ success: user });
    });
};

// Show all accounts
const getAllUsers = async (req, res) => {
    try {
        const accounts = await accountModel.find({})
        return res.send(accounts);
    }
    catch (error) {
        res.status(500).json({ error })
    }
};


//Show account by ID
const getAccountById = async (req, res) => {
    const { id } = req.params;
    try {
        let account = await accountModel.findOne({ "israeliId": id })
        if(account)  return res.status(200).send(account)
    }
    catch (error) {
        return res.status(404).send(error)
    }
};


module.exports = {
    geAll: getAllUsers,
    getSpecificAccount: getAccountById,
    create: createAccount,
};