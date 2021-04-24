const accountModel = require("../models/account.model");
const trasnactionModel = require("../models/transactions.model");

// deposit
const updateCash = async (req, res) => {
    const { amount } = req.body;
    try {
        const accountToUpdate = await accountModel.findOne({ israeliId: req.params.id })
        if (!accountToUpdate) {
            return res.status(404).send({ error: 'Account not found' })
        }
        const account = await accountModel.findByIdAndUpdate(accountToUpdate._id, { $inc: { "account.cash": amount } }, { new: true, runValidators: true });
        const trasnaction = new trasnactionModel({
            to: accountToUpdate.israeliId,
            operation_type: "deposit",
            amount: amount
        });
        trasnaction.save((err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(201).json({ account: account, trasnaction });
        });
    }
    catch (error) {
        res.status(400).json(error)
    }
};

const updateCredit = async (req, res) => {
    const { amount } = req.body;
    try {
        const accountToUpdate = await accountModel.findOne({ israeliId: req.params.id })
        if (!accountToUpdate) {
            return res.status(404).send({ error: 'Account not found' })
        }
        const account = await accountModel.findByIdAndUpdate(accountToUpdate._id, { $inc: { "account.credit": amount } }, { new: true, runValidators: true });

        const trasnaction = new trasnactionModel({
            to: accountToUpdate.israeliId,
            operation_type: "update credit",
            amount: amount
        });
        trasnaction.save((err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(201).json({ account: account, trasnaction });
        });
    }
    catch (error) {
        res.status(400).json(error)
    }
};


const withdrawMoney = async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;
    try {
        const accountToUpdate = await accountModel.findOne({ israeliId: id })
        if (!accountToUpdate) {
            return res.status(404).send({ error: 'Account not found' })
        }
        if (accountToUpdate.account.credit + accountToUpdate.account.cash < amount) {
            return res.status(400).send({ error: 'Not enough money' })
        }
        const account = await accountModel.findByIdAndUpdate(accountToUpdate._id, { $inc: { "account.cash": -amount } }, { new: true, runValidators: true });
        const trasnaction = new trasnactionModel({
            to: account._id,
            operation_type: "withdraw",
            amount: amount
        });
        trasnaction.save((err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(201).json({ account: account, trasnaction });
        });
    }
    catch (error) {
        res.status(400).json(error)
    }
};


const transferMoney = async (req, res) => {
    const { fromAccount, toAccount } = req.params;
    const { amount } = req.body;
    try {
        const fromUser = await accountModel.findOne({ israeliId: fromAccount })
        const toUser = await accountModel.findOne({ israeliId: toAccount })

        if (!fromUser || !toUser || fromUser === toUser) {
            return res.status(404).send({ error: 'Account not found' })
        }
        if (fromUser.account.credit + fromUser.account.cash < amount) {
            return res.status(400).send({ error: 'Not enough money' })
        }
        const fromUserA = await accountModel.findByIdAndUpdate(fromUser._id, { $inc: { "account.cash": -amount } }, { new: true, runValidators: true });
        const toUserA = await accountModel.findByIdAndUpdate(toUser._id, { $inc: { "account.cash": amount } }, { new: true, runValidators: true });

        const trasnaction = new trasnactionModel({
            from: fromUserA.israeliId,
            to: toUserA.israeliId,
            operation_type: "transfer between accounts",
            amount: amount
        });

        console.log(trasnaction, 'trasnaction');

        trasnaction.save((err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(201).json({ trasnaction });
        });
    }
    catch (error) {
        res.status(400).json(error)
    }
};

const userTransactions = async (req, res) => {
    const { id } = req.params;
    try {
        let transactions = await trasnactionModel.find({ to: id })
        if (transactions) return res.status(200).send(transactions)
    }
    catch (error) {
        return res.status(404).send(error)
    }
};


module.exports = {
    transfer: transferMoney,
    deposit: updateCash,
    updateCredit: updateCredit,
    withdraw: withdrawMoney,
    transactions: userTransactions
};
