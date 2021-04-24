const express = require("express");
const router = express.Router();
const accountControler = require("../controllers/transactions.controller");

router
  .get("/:id", (req, res) => {
    accountControler.transactions(req, res);
  })
  .put("/transfer/:fromAccount/:toAccount", (req, res) => {
    accountControler.transfer(req, res);
  })
  .put("/depositing/:id", (req, res) => {
    accountControler.deposit(req, res);
  })
  .put("/updateCredit/:id", (req, res) => {
    accountControler.updateCredit(req, res);
  })
  .put("/withdrawMoney/:id", (req, res) => {
    accountControler.withdraw(req, res);
  })

module.exports = router;
